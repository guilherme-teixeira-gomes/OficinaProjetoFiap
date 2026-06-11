import { DiagnosticRepository } from "../../../infrastructure/repositories/DiagnosticRepository";
import { PartRepository } from "../../../infrastructure/repositories/PartRepository";
import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";
import { ServiceRepository } from "../../../infrastructure/repositories/ServiceRepository";
import { AddDiagnosticDTO } from "../../../shared/types/service-order.types";


export class AddDiagnosticUseCase {
  async execute(orderId: number, diagnosticData: AddDiagnosticDTO) {
    const order = await ServiceOrderRepository.findOne({ 
      where: { id: orderId },
      relations: ["diagnostics"]
    });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (order.status !== "EM_DIAGNOSTICO") {
      throw new Error("Só é possível adicionar diagnósticos em status EM_DIAGNOSTICO");
    }
    
    const recommendedServices = diagnosticData.serviceIds?.length 
      ? await ServiceRepository.findByIds(diagnosticData.serviceIds)
      : [];
      
    const recommendedParts = diagnosticData.partIds?.length
      ? await PartRepository.findByIds(diagnosticData.partIds)
      : [];
    
    const diagnostic = DiagnosticRepository.create({
      title: diagnosticData.title,
      description: diagnosticData.description,
      includeInBudget: diagnosticData.includeInBudget,
      priority: diagnosticData.priority || "media", 
      mechanicNote: diagnosticData.mechanicNote,    
      recommendedServices,
      recommendedParts,
      serviceOrder: order
    });
    
    return await DiagnosticRepository.save(diagnostic);
  }
}