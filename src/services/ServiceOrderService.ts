import { ClientRepository } from "../repositories/ClientRepository";
import { VehicleRepository } from "../repositories/VehicleRepository";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { PartRepository } from "../repositories/PartRepository";
import { ServiceOrderRepository } from "../repositories/ServiceOrderRepository";
import { UserRepository } from "../repositories/UserRepository";
import { DiagnosticRepository } from "../repositories/DiagnosticRepository";
import { Not } from "typeorm";
import { ServiceOrder } from "../entities/ServiceOrder";
import { CreateFullServiceOrderDTO, AddDiagnosticDTO, CreateServiceOrderDTO } from "../types/service-order.types";

export class ServiceOrderService {

  async create(data: CreateFullServiceOrderDTO) {
    let client = await ClientRepository.findOne({
      where: { document: data.client.document }
    });
    
    if (!client) {
      client = await ClientRepository.save({
        name: data.client.name,
        document: data.client.document,
        email: data.client.email,
        phone: data.client.phone
      });
    }

    let vehicle = await VehicleRepository.findOne({
      where: { plate: data.vehicle.plate },
      relations: ["client"]
    });
    
    if (!vehicle) {
      vehicle = await VehicleRepository.save({
        plate: data.vehicle.plate,
        brand: data.vehicle.brand,
        model: data.vehicle.model,
        year: data.vehicle.year,
        client: client
      });
    } else {
      if (vehicle.client.id !== client.id) {
        throw new Error("Este veículo já está cadastrado para outro cliente");
      }
    }
    const order = ServiceOrderRepository.create({
      client,
      vehicle,
      status: "RECEBIDA",
      budget: 0,
      observation: data.observation 
    });

    return await ServiceOrderRepository.save(order);
  }

  async acceptOrder(orderId: number, mechanicId: number) {
    const mechanic = await UserRepository.findOne({ 
      where: { 
        id: mechanicId,
        role: "mecanico" 
      } 
    });
    
    if (!mechanic) {
      throw new Error("Mecânico não encontrado ou não autorizado");
    }

    const order = await ServiceOrderRepository.findOne({ 
      where: { id: orderId }
    });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    
    if (order.status !== "RECEBIDA") {
      throw new Error("Ordem de serviço precisa estar com status RECEBIDA");
    }
    
    if (order.mechanicId) {
      throw new Error("Esta OS já foi aceita por outro mecânico");
    }
    
    order.status = "EM_DIAGNOSTICO";
    order.mechanic = mechanic;
    order.mechanicId = mechanicId;
    order.startedAt = new Date();
    
    return await ServiceOrderRepository.save(order);
  }

  async addDiagnostic(orderId: number, diagnosticData: AddDiagnosticDTO) {
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

  async finishDiagnostic(orderId: number) {
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
    
    const budget = await this.calculateBudgetFromDiagnostics(order);
    
    order.status = "AGUARDANDO_APROVACAO";
    order.budget = budget;
    
    await ServiceOrderRepository.save(order);
  
    const budgetItems = order.diagnostics
      .filter(d => d.includeInBudget)
      .map(d => ({
        diagnosticId: d.id,
        title: d.title,
        description: d.description,
        priority: d.priority,
        mechanicNote: d.mechanicNote,
        services: d.recommendedServices,
        parts: d.recommendedParts,
        total: this.calculateDiagnosticTotal(d)
      }));
    
    const optionalItems = order.diagnostics
      .filter(d => !d.includeInBudget)
      .map(d => ({
        diagnosticId: d.id,
        title: d.title,
        description: d.description,
        priority: d.priority,
        mechanicNote: d.mechanicNote,
        services: d.recommendedServices,
        parts: d.recommendedParts,
        total: this.calculateDiagnosticTotal(d)
      }));
    
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

  private calculateDiagnosticTotal(diagnostic: any): number {
    const servicesTotal = diagnostic.recommendedServices
      .reduce((sum, s) => sum + Number(s.price), 0);
    const partsTotal = diagnostic.recommendedParts
      .reduce((sum, p) => sum + Number(p.price), 0);
    return servicesTotal + partsTotal;
  }

  private async calculateBudgetFromDiagnostics(order: ServiceOrder) {
    const approvedDiagnostics = order.diagnostics.filter(d => d.includeInBudget);
    let total = 0;
    
    for (const diagnostic of approvedDiagnostics) {
      total += this.calculateDiagnosticTotal(diagnostic);
    }
    
    return total;
  }

  async approve(id: number, approvedDiagnosticIds?: number[]) {
    const order = await ServiceOrderRepository.findOne({ 
      where: { id },
      relations: [
        "diagnostics",
        "diagnostics.recommendedServices",
        "diagnostics.recommendedParts"
      ]
    });
    
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (order.approved) throw new Error("Orçamento já aprovado");
    if (order.status !== "AGUARDANDO_APROVACAO") {
      throw new Error("Ordem precisa estar aguardando aprovação");
    }
    
    const toApprove = approvedDiagnosticIds || 
      order.diagnostics.filter(d => d.includeInBudget).map(d => d.id);
    const approvedServices = [];
    const approvedParts = [];
    
    for (const diagnostic of order.diagnostics) {
      if (toApprove.includes(diagnostic.id)) {
        approvedServices.push(...diagnostic.recommendedServices);
        approvedParts.push(...diagnostic.recommendedParts);
      }
    }
    
    order.services = [...new Set(approvedServices)];
    order.parts = [...new Set(approvedParts)];

    const totalServices = order.services.reduce((sum, s) => sum + Number(s.price), 0);
    const totalParts = order.parts.reduce((sum, p) => sum + Number(p.price), 0);
    
    order.approved = true;
    order.approvedAt = new Date();
    order.status = "EM_EXECUCAO";
    order.budget = totalServices + totalParts;
    
    return ServiceOrderRepository.save(order);
  }

  async list() {
    return ServiceOrderRepository.find({ 
      relations: [
        "client", 
        "vehicle", 
        "services", 
        "parts",
        "mechanic",
        "diagnostics",
        "diagnostics.recommendedServices",
        "diagnostics.recommendedParts"
      ] 
    });
  }

  async getById(id: number) {
    return ServiceOrderRepository.findOne({ 
      where: { id }, 
      relations: [
        "client", 
        "vehicle", 
        "services", 
        "parts",
        "mechanic", 
        "diagnostics",
        "diagnostics.recommendedServices",
        "diagnostics.recommendedParts"
      ] 
    });
  }

  async updateStatus(id: number, status: string) {
    const validStatus = [
      "RECEBIDA", 
      "EM_DIAGNOSTICO", 
      "AGUARDANDO_APROVACAO", 
      "EM_EXECUCAO", 
      "FINALIZADA", 
      "ENTREGUE"
    ];
    
    if (!validStatus.includes(status)) {
      throw new Error(`Status inválido. Use: ${validStatus.join(", ")}`);
    }
    
    const order = await ServiceOrderRepository.findOne({ where: { id } });
    if (!order) throw new Error("Ordem de serviço não encontrada");
    
    order.status = status;
    return ServiceOrderRepository.save(order);
  }

  async finish(id: number) {
    const order = await ServiceOrderRepository.findOne({ where: { id } });
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (!order.approved) throw new Error("Não pode finalizar antes da aprovação");
    if (order.status !== "EM_EXECUCAO") {
      throw new Error("Ordem precisa estar em execução");
    }
    
    order.status = "FINALIZADA";
    order.finishedAt = new Date();
    return ServiceOrderRepository.save(order);
  }

  async deliver(id: number) {
    const order = await ServiceOrderRepository.findOne({ where: { id } });
    if (!order) throw new Error("Ordem de serviço não encontrada");
    if (order.status !== "FINALIZADA") {
      throw new Error("Só é possível entregar OS finalizada");
    }
    
    order.status = "ENTREGUE";
    return ServiceOrderRepository.save(order);
  }

async averageExecutionTime() {
  const orders = await ServiceOrderRepository.find({ 
    where: { 
      finishedAt: Not(null),
      startedAt: Not(null) 
    } 
  });


  if (!orders.length) return 0;
  
  let totalMinutes = 0;
  let validOrders = 0;
  
  for (const o of orders) {
    if (o.startedAt && o.finishedAt) {
      const start = new Date(o.startedAt).getTime();
      const end = new Date(o.finishedAt).getTime();
      
      if (!isNaN(start) && !isNaN(end) && end > start) {
        const diffMs = end - start;
        const diffMinutes = diffMs / (1000 * 60);   
        totalMinutes += diffMinutes;
        validOrders++;
      }
    }
  }
  
  if (validOrders === 0) {
    return 0;
  }
  
  const avgMinutes = totalMinutes / validOrders;
  return Number(avgMinutes.toFixed(2));
}
}