import { ServiceOrderRepository } from "../../../infrastructure/repositories/ServiceOrderRepository";
import { calculateBudgetFromDiagnostics, calculateDiagnosticTotal } from "../../../shared/helpers/helpers";


export class FinishDiagnosticUseCase {
  async execute(orderId: number) {
    const order = await ServiceOrderRepository.findOne({ 
      where: { id: orderId },
      relations: [
        "diagnostics",
        "diagnostics.recommendedServices",
        "diagnostics.recommendedParts"
      ]
    });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (order.status !== "EM_DIAGNOSTICO") {
      throw new Error("Ordem de serviço não está em diagnóstico");
    }
    
    const budget = await calculateBudgetFromDiagnostics(order); 
    
    order.status = "AGUARDANDO_APROVACAO";
    order.budget = budget;
    
    await ServiceOrderRepository.save(order);
  
    const budgetItems = order.diagnostics
      ?.filter(d => d.includeInBudget)
      .map(d => ({
        diagnosticId: d.id,
        title: d.title,
        description: d.description,
        priority: d.priority,
        mechanicNote: d.mechanicNote,
        services: d.recommendedServices,
        parts: d.recommendedParts,
        total: calculateDiagnosticTotal(d) 
      })) || [];
    
    const optionalItems = order.diagnostics
      ?.filter(d => !d.includeInBudget)
      .map(d => ({
        diagnosticId: d.id,
        title: d.title,
        description: d.description,
        priority: d.priority,
        mechanicNote: d.mechanicNote,
        services: d.recommendedServices,
        parts: d.recommendedParts,
        total: calculateDiagnosticTotal(d) 
      })) || [];
    
    return {
      orderId: order.id,
      status: order.status,
      budget: budget,
      observation: order.observation,
      items: budgetItems,
      optional: optionalItems,
      message: "Orçamento gerado. Aguardando aprovação do cliente."
    };
  }
}