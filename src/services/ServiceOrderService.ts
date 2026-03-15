import { ClientRepository } from "../repositories/ClientRepository";
import { VehicleRepository } from "../repositories/VehicleRepository";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { PartRepository } from "../repositories/PartRepository";
import { ServiceOrderRepository } from "../repositories/ServiceOrderRepository";
import { UserRepository } from "../repositories/UserRepository";
import { DiagnosticRepository } from "../repositories/DiagnosticRepository";
import { ServiceOrder } from "../entities/ServiceOrder";
import { AddDiagnosticDTO, CreateServiceOrderDTO } from "../types/service-order.types";
import { ServiceExecutionService } from "./ServiceExecutionService";
import { cpf, cnpj } from "cpf-cnpj-validator";

function calculateDiagnosticTotal(diagnostic: any): number {
  const servicesTotal = diagnostic.recommendedServices
    ?.reduce((sum: number, s: any) => sum + Number(s.price), 0) || 0;
  const partsTotal = diagnostic.recommendedParts
    ?.reduce((sum: number, p: any) => sum + Number(p.price), 0) || 0;
  return servicesTotal + partsTotal;
}

async function calculateBudgetFromDiagnostics(order: ServiceOrder) {
  const approvedDiagnostics = order.diagnostics?.filter(d => d.includeInBudget) || [];
  let total = 0;
  
  for (const diagnostic of approvedDiagnostics) {
    total += calculateDiagnosticTotal(diagnostic);
  }
  
  return total;
}

function validateDocument(document: string) {
  const cleaned = document.replace(/\D/g, "");

  if (!cpf.isValid(cleaned) && !cnpj.isValid(cleaned)) {
    throw new Error("CPF ou CNPJ inválido");
  }

  return cleaned;
}


function validatePlate(plate: string) {
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

  const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

  if (!plateRegex.test(normalized)) {
    throw new Error("Placa de veículo inválida");
  }

  return normalized;
}

export class ServiceOrderService {
  async create(data: CreateServiceOrderDTO) {

  if (data.client?.document) {
    data.client.document = validateDocument(data.client.document);
  }

  if (data.vehicle?.plate) {
    data.vehicle.plate = validatePlate(data.vehicle.plate);
  }

    let client = await ClientRepository.findOne({
      where: { document: data.client.document },
      relations: ["vehicles"]
    });
    
    if (!client) {
      if (!data.client.name || !data.client.email || !data.client.phone) {
        throw new Error("Cliente não encontrado. Para criar um novo, é necessário fornecer nome, email e telefone.");
      }

      client = await ClientRepository.save({
        name: data.client.name,
        document: data.client.document,
        email: data.client.email,
        phone: data.client.phone
      });

      if (!data.vehicle.plate) {
        throw new Error("Cliente criado. Agora cadastre o veículo.");
      }

      const vehicle = await VehicleRepository.save({
        plate: data.vehicle.plate,
        brand: data.vehicle.brand,
        model: data.vehicle.model,
        year: data.vehicle.year,
        client: client
      });

      const order = ServiceOrderRepository.create({
        client,
        vehicle,
        status: "RECEBIDA",
        budget: 0,
        observation: data.observation
      });

      const savedOrder = await ServiceOrderRepository.save(order);
      
      return await ServiceOrderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ["client", "vehicle", "services", "parts", "mechanic"]
      });
    }
    
    if (data.vehicle.id) {
      const vehicle = await VehicleRepository.findOne({
        where: { 
          id: data.vehicle.id,
          client: { id: client.id }
        }
      });

      if (!vehicle) {
        throw new Error("Veículo não encontrado ou não pertence a este cliente");
      }

      const order = ServiceOrderRepository.create({
        client,
        vehicle,
        status: "RECEBIDA",
        budget: 0,
        observation: data.observation
      });

      const savedOrder = await ServiceOrderRepository.save(order);
      
      return await ServiceOrderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ["client", "vehicle", "services", "parts", "mechanic"]
      });
    }
    
    else if (data.vehicle.plate) {
      const existingVehicle = await VehicleRepository.findOne({
        where: { plate: data.vehicle.plate },
        relations: ["client"]
      });

      if (existingVehicle) {
        if (existingVehicle.client.id === client.id) {
          const order = ServiceOrderRepository.create({
            client,
            vehicle: existingVehicle,
            status: "RECEBIDA",
            budget: 0,
            observation: data.observation
          });
          const savedOrder = await ServiceOrderRepository.save(order);
          
          return await ServiceOrderRepository.findOne({
            where: { id: savedOrder.id },
            relations: ["client", "vehicle", "services", "parts", "mechanic"]
          });
        } else {
          throw new Error("Este veículo já está cadastrado para outro cliente");
        }
      }
      if (!data.vehicle.brand || !data.vehicle.model || !data.vehicle.year) {
        throw new Error("Para cadastrar um novo veículo, é necessário fornecer marca, modelo e ano");
      }

      const vehicle = await VehicleRepository.save({
        plate: data.vehicle.plate,
        brand: data.vehicle.brand,
        model: data.vehicle.model,
        year: data.vehicle.year,
        client: client
      });

      const order = ServiceOrderRepository.create({
        client,
        vehicle,
        status: "RECEBIDA",
        budget: 0,
        observation: data.observation
      });

      const savedOrder = await ServiceOrderRepository.save(order);
      
      return await ServiceOrderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ["client", "vehicle", "services", "parts", "mechanic"]
      });
    }
    
    else {
      return {
        success: true,
        message: "Cliente encontrado. Selecione um veículo.",
        data: {
          client: {
            id: client.id,
            name: client.name,
            document: client.document,
            email: client.email,
            phone: client.phone
          },
          vehicles: client.vehicles?.map(v => ({
            id: v.id,
            plate: v.plate,
            brand: v.brand,
            model: v.model,
            year: v.year
          })) || []
        }
      };
    }
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
    
    const savedOrder = await ServiceOrderRepository.save(order);
    
    return await ServiceOrderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ["client", "vehicle", "services", "parts", "mechanic"]
    });
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
  
    if (!order.diagnostics || order.diagnostics.length === 0) {
      throw new Error("Nenhum diagnóstico encontrado para esta OS");
    }
  
    const toApprove =
      approvedDiagnosticIds && approvedDiagnosticIds.length > 0
        ? approvedDiagnosticIds
        : order.diagnostics
            .filter(d => d.includeInBudget)
            .map(d => d.id);
  
    const serviceIds = new Set<number>();
    const partIds = new Set<number>();
  
    for (const diagnostic of order.diagnostics) {
      if (!toApprove.includes(diagnostic.id)) continue;
  
      for (const service of diagnostic.recommendedServices || []) {
        serviceIds.add(service.id);
      }
  
      for (const part of diagnostic.recommendedParts || []) {
        partIds.add(part.id);
      }
    }
  
    const approvedServiceIds = [...serviceIds];
    const approvedPartIds = [...partIds];
  
    const approvedServices =
      approvedServiceIds.length > 0
        ? await ServiceRepository.findByIds(approvedServiceIds)
        : [];
  
    const approvedParts =
      approvedPartIds.length > 0
        ? await PartRepository.findByIds(approvedPartIds)
        : [];
  
    const totalServices = approvedServices.reduce(
      (sum, s) => sum + Number(s.price),
      0
    );
  
    const totalParts = approvedParts.reduce(
      (sum, p) => sum + Number(p.price),
      0
    );
  
    const totalBudget = Number((totalServices + totalParts).toFixed(2));
  
    order.services = approvedServices;
    order.parts = approvedParts;
    order.approved = true;
    order.approvedAt = new Date();
    order.status = "EM_EXECUCAO";
    order.budget = totalBudget;
  
    await ServiceOrderRepository.save(order);
  
    const executionService = new ServiceExecutionService();
    await executionService.createExecutionsFromApprovedOrder(order.id);
  
    const result = await ServiceOrderRepository.findOne({
      where: { id: order.id },
      relations: ["client", "vehicle", "services", "parts", "mechanic"]
    });
  
    return {
      ...result,
      budget: totalBudget,
      services:
        result?.services?.map(s => ({
          ...s,
          price: Number(s.price)
        })) || [],
      parts:
        result?.parts?.map(p => ({
          ...p,
          price: Number(p.price)
        })) || []
    };
  }
  async list() {
    const orders = await ServiceOrderRepository.find({ 
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
    
    return orders.map(order => ({
      ...order,
      services: order.services?.map(s => ({ ...s, price: Number(s.price) })),
      parts: order.parts?.map(p => ({ ...p, price: Number(p.price) }))
    }));
  }

  async getById(id: number) {
    const order = await ServiceOrderRepository.findOne({
      where: { id },
      relations: [
        "client",
        "vehicle",
        "services",
        "parts",
        "mechanic",
        "diagnostics",
        "diagnostics.recommendedServices",
        "diagnostics.recommendedParts",
        "executions",
        "executions.service"
      ]
    });
  
    if (!order) return null;
  
    return {
      ...order,
      services: order.services?.map(s => ({ ...s, price: Number(s.price) })),
      parts: order.parts?.map(p => ({ ...p, price: Number(p.price) })),
      executions: order.executions?.map(e => ({
        ...e,
        service: e.service,
        durationMinutes: e.durationMinutes
      }))
    };
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

 
}