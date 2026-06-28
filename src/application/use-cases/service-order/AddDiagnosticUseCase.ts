import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";
import { Diagnostic } from "../../../domain/entities/Diagnostic";
import { Service } from "../../../domain/entities/Service";
import { Part } from "../../../domain/entities/Part";
import { AddDiagnosticDTO } from "../../../shared/types/service-order.types";

export class AddDiagnosticUseCase {
  async execute(orderId: number, diagnosticData: AddDiagnosticDTO) {
    const orderRepo = AppDataSource.getRepository(ServiceOrder);
    const diagnosticRepo = AppDataSource.getRepository(Diagnostic);
    const serviceRepo = AppDataSource.getRepository(Service);
    const partRepo = AppDataSource.getRepository(Part);

    const order = await orderRepo.findOne({ 
      where: { id: orderId },
      relations: ["diagnostics"]
    });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (order.status !== "EM_DIAGNOSTICO") {
      throw new Error("Só é possível adicionar diagnósticos em status EM_DIAGNOSTICO");
    }
    
    const recommendedServices = diagnosticData.serviceIds?.length 
      ? await serviceRepo.findByIds(diagnosticData.serviceIds)
      : [];
      
    const recommendedParts = diagnosticData.partIds?.length
      ? await partRepo.findByIds(diagnosticData.partIds)
      : [];
    
    const diagnostic = diagnosticRepo.create({
      title: diagnosticData.title,
      description: diagnosticData.description,
      includeInBudget: diagnosticData.includeInBudget,
      priority: diagnosticData.priority || "media",
      mechanicNote: diagnosticData.mechanicNote,
      recommendedServices,
      recommendedParts,
      serviceOrder: order
    });
    
    return await diagnosticRepo.save(diagnostic);
  }
}