import { AppDataSource } from "../../../infrastructure/database/data-source";
import { ServiceOrder } from "../../../domain/entities/ServiceOrder";
import { Service } from "../../../domain/entities/Service";
import { Part } from "../../../domain/entities/Part";
import { CheckStockAvailabilityUseCase } from "../stock/CheckStockAvailabilityUseCase";
import { ReserveStockUseCase } from "../stock/ReserveStockUseCase";
import { RestoreStockUseCase } from "../stock/RestoreStockUseCase";
import { CreateExecutionsFromApprovedOrderUseCase } from "../service-execution/CreateExecutionsFromApprovedOrderUseCase";
import { sendEmail, emailStatusAtualizado } from "../../../infrastructure/email/EmailService";

interface PartWithQuantity {
  part: any;
  quantity: number;
}

export class ApproveOrderUseCase {
  private checkStockAvailabilityUseCase: CheckStockAvailabilityUseCase;
  private reserveStockUseCase: ReserveStockUseCase;
  private restoreStockUseCase: RestoreStockUseCase;
  private createExecutionsUseCase: CreateExecutionsFromApprovedOrderUseCase;

  constructor() {
    this.checkStockAvailabilityUseCase = new CheckStockAvailabilityUseCase();
    this.reserveStockUseCase = new ReserveStockUseCase();
    this.restoreStockUseCase = new RestoreStockUseCase();
    this.createExecutionsUseCase = new CreateExecutionsFromApprovedOrderUseCase();
  }

  async execute(id: number, approvedDiagnosticIds?: number[]) {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const orderRepo = AppDataSource.getRepository(ServiceOrder);
    const serviceRepo = AppDataSource.getRepository(Service);
    const partRepo = AppDataSource.getRepository(Part);

    const order = await orderRepo.findOne({
      where: { id },
      relations: ["diagnostics", "diagnostics.recommendedServices", "diagnostics.recommendedParts"]
    });
  
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (order.approved) throw new Error("Orçamento já aprovado");
    if (order.status !== "AGUARDANDO_APROVACAO") throw new Error("Ordem precisa estar aguardando aprovação");
    if (!order.diagnostics || order.diagnostics.length === 0) throw new Error("Nenhum diagnóstico encontrado para esta OS");
  
    const toApprove = approvedDiagnosticIds && approvedDiagnosticIds.length > 0
      ? approvedDiagnosticIds
      : order.diagnostics.filter(d => d.includeInBudget).map(d => d.id);
  
    const serviceIds = new Set<number>();
    const partIds = new Set<number>();
    const partsWithQuantities = new Map<number, PartWithQuantity>();
  
    for (const diagnostic of order.diagnostics) {
      if (!toApprove.includes(diagnostic.id)) continue;
      for (const service of diagnostic.recommendedServices || []) serviceIds.add(service.id);
      for (const part of diagnostic.recommendedParts || []) {
        partIds.add(part.id);
        const current = partsWithQuantities.get(part.id);
        if (current) { current.quantity++; } else { partsWithQuantities.set(part.id, { part, quantity: 1 }); }
      }
    }
  
    const approvedServices = serviceIds.size ? await serviceRepo.findByIds([...serviceIds]) : [];
    const approvedParts = partIds.size ? await partRepo.findByIds([...partIds]) : [];
  
    const stockErrors = [];
    for (const part of approvedParts) {
      const quantity = partsWithQuantities.get(part.id)?.quantity || 1;
      const availability = await this.checkStockAvailabilityUseCase.execute(part.id, quantity);
      if (!availability.available) {
        stockErrors.push({ partName: part.name, required: quantity, available: availability.currentStock });
      }
    }
    if (stockErrors.length > 0) {
      const errors = stockErrors.map(e => `${e.partName}: necessário ${e.required}, disponível ${e.available}`).join("; ");
      throw new Error(`Estoque insuficiente para aprovação: ${errors}`);
    }
  
    const totalServices = approvedServices.reduce((sum, s) => sum + Number(s.price), 0);
    const totalParts = approvedParts.reduce((sum, p) => sum + Number(p.price), 0);
    const totalBudget = Number((totalServices + totalParts).toFixed(2));
  
    order.services = approvedServices;
    order.parts = approvedParts;
    order.approved = true;
    order.approvedAt = new Date();
    order.status = "EM_EXECUCAO";
    order.budget = totalBudget;
    await orderRepo.save(order);
  
    const stockMovements = [];
    for (const part of approvedParts) {
      const quantity = partsWithQuantities.get(part.id)?.quantity || 1;
      try {
        const movement = await this.reserveStockUseCase.execute(part.id, quantity, order.id, `Baixa para OS #${order.id} - ${part.name} (${quantity} unidade(s))`);
        stockMovements.push(movement);
      } catch (error: any) {
        for (const movement of stockMovements) {
          await this.restoreStockUseCase.execute(movement.partId, Math.abs(movement.quantity), order.id);
        }
        throw new Error(`Falha ao dar baixa no estoque: ${error.message}`);
      }
    }
  
    await this.createExecutionsUseCase.execute(order.id);
  
    const result = await orderRepo.findOne({
      where: { id: order.id },
      relations: ["client", "vehicle", "services", "parts", "mechanic"]
    });
  
    if (result?.client?.email) {
      const { subject, html } = emailStatusAtualizado(result.client.name, result.id, result.status);
      await sendEmail({ to: result.client.email, subject, html }).catch(err => console.error("Falha ao enviar email:", err.message));
    }
  
    return {
      ...result,
      budget: totalBudget,
      services: result?.services?.map(s => ({ ...s, price: Number(s.price) })) || [],
      parts: result?.parts?.map(p => ({ ...p, price: Number(p.price) })) || []
    };
  }
}