import { ServiceExecutionRepository } from "../repositories/ServiceExecutionRepository";
import { ServiceOrderRepository } from "../repositories/ServiceOrderRepository";
import { In, Not, Between } from "typeorm"; 

interface StartServiceDTO {
  serviceOrderId: number;
  serviceId: number;
}

interface FinishServiceDTO {
  serviceOrderId: number;
  serviceId: number;
  mechanicNote?: string;
}

export class ServiceExecutionService {
  async createExecutionsFromApprovedOrder(serviceOrderId: number) {
    const order = await ServiceOrderRepository.findOne({
      where: { id: serviceOrderId },
      relations: ["services"]
    });

    if (!order) throw new Error("Ordem não encontrada");

    for (const service of order.services) {
      const exists = await ServiceExecutionRepository.findOne({
        where: {
          serviceOrderId: order.id,
          serviceId: service.id
        }
      });

      if (!exists) {
        await ServiceExecutionRepository.save({
          serviceOrderId: order.id,
          serviceId: service.id,
          status: "PENDENTE"
        });
      }
    }
  }

  async startService(data: StartServiceDTO) {
    let execution = await ServiceExecutionRepository.findOne({
      where: {
        serviceOrderId: data.serviceOrderId,
        serviceId: data.serviceId
      }
    });

    if (!execution) {
      execution = ServiceExecutionRepository.create({
        serviceOrderId: data.serviceOrderId,
        serviceId: data.serviceId,
        status: "EM_ANDAMENTO",
        startedAt: new Date()
      });
    } else {
      if (execution.status === "CONCLUIDO") {
        throw new Error("Este serviço já foi concluído");
      }
      execution.startedAt = new Date();
      execution.status = "EM_ANDAMENTO";
    }

    return await ServiceExecutionRepository.save(execution);
  }

  async finishService(data: FinishServiceDTO) {
    const execution = await ServiceExecutionRepository.findOne({
      where: {
        serviceOrderId: data.serviceOrderId,
        serviceId: data.serviceId
      },
      relations: ["service"]
    });

    if (!execution) {
      throw new Error("Execução não encontrada");
    }

    if (execution.status === "CONCLUIDO") {
      throw new Error("Serviço já foi concluído");
    }

    execution.finishedAt = new Date();
    execution.status = "CONCLUIDO";
    execution.mechanicNote = data.mechanicNote;

    if (execution.startedAt) {
      const durationMs = execution.finishedAt.getTime() - execution.startedAt.getTime();
      execution.durationMinutes = Math.round(durationMs / 60000);
    }

    await ServiceExecutionRepository.save(execution);
    await this.checkAndFinishOrder(data.serviceOrderId);

    return execution;
  }

  private async checkAndFinishOrder(serviceOrderId: number) {
    const executions = await ServiceExecutionRepository.find({
      where: { serviceOrderId }
    });

    const total = executions.length;
    const concluded = executions.filter(e => e.status === "CONCLUIDO").length;

    if (total > 0 && total === concluded) {
      const order = await ServiceOrderRepository.findOne({
        where: { id: serviceOrderId }
      });

      if (order && order.status === "EM_EXECUCAO") {
        order.status = "FINALIZADA";
        order.finishedAt = new Date();
        await ServiceOrderRepository.save(order);
      }
    }
  }

  async getAverageTimeByService(serviceId: number) {
    const executions = await ServiceExecutionRepository.find({
      where: {
        serviceId,
        status: "CONCLUIDO",
        durationMinutes: Not(null)
      }
    });

    if (executions.length === 0) {
      return {
        serviceId,
        averageMinutes: 0,
        averageHours: "0",
        totalExecutions: 0,
        minMinutes: 0,
        maxMinutes: 0
      };
    }

    const durations = executions.map(e => e.durationMinutes || 0);
    const total = durations.reduce((sum, d) => sum + d, 0);
    const average = total / executions.length;

    return {
      serviceId,
      averageMinutes: Number(average.toFixed(2)),
      averageHours: (average / 60).toFixed(2),
      totalExecutions: executions.length,
      minMinutes: Math.min(...durations),
      maxMinutes: Math.max(...durations)
    };
  }

  async getAllServicesAverage() {
    const executions = await ServiceExecutionRepository.find({
      where: {
        status: "CONCLUIDO",
        durationMinutes: Not(null)
      },
      relations: ["service"]
    });

    const servicesMap = new Map();

    for (const exec of executions) {
      if (!servicesMap.has(exec.serviceId)) {
        servicesMap.set(exec.serviceId, {
          serviceId: exec.serviceId,
          serviceName: exec.service?.name,
          durations: [],
          total: 0
        });
      }
      const service = servicesMap.get(exec.serviceId);
      service.durations.push(exec.durationMinutes || 0);
    }

    const result = [];
    for (const [_, data] of servicesMap) {
      const avg = data.durations.reduce((a, b) => a + b, 0) / data.durations.length;
      result.push({
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        averageMinutes: Number(avg.toFixed(2)),
        averageHours: (avg / 60).toFixed(2),
        totalExecutions: data.durations.length,
        minMinutes: Math.min(...data.durations),
        maxMinutes: Math.max(...data.durations)
      });
    }

    return result;
  }

  async getServiceOrderTimeline(serviceOrderId: number) {
    const executions = await ServiceExecutionRepository.find({
      where: { serviceOrderId },
      relations: ["service"],
      order: { startedAt: "ASC" }
    });

    const order = await ServiceOrderRepository.findOne({
      where: { id: serviceOrderId }
    });

    return {
      serviceOrder: {
        id: order?.id,
        status: order?.status,
        startedAt: order?.startedAt,
        finishedAt: order?.finishedAt,
        totalDuration: order?.startedAt && order?.finishedAt
          ? Math.round((order.finishedAt.getTime() - order.startedAt.getTime()) / 60000)
          : null
      },
      services: executions.map(e => ({
        serviceId: e.serviceId,
        serviceName: e.service?.name,
        status: e.status,
        startedAt: e.startedAt,
        finishedAt: e.finishedAt,
        durationMinutes: e.durationMinutes,
        mechanicNote: e.mechanicNote
      }))
    };
  }

  async getExecutionsByPeriod(startDate: Date, endDate: Date) {
    return await ServiceExecutionRepository.find({
      where: {
        startedAt: Between(startDate, endDate),
        status: "CONCLUIDO"
      },
      relations: ["service", "serviceOrder", "serviceOrder.mechanic"]
    });
  }

  async getProductivityReport(startDate: Date, endDate: Date) {
    const executions = await this.getExecutionsByPeriod(startDate, endDate);
    
    const mechanicMap = new Map();
    
    for (const exec of executions) {
      const mechanicId = exec.serviceOrder?.mechanicId;
      if (!mechanicId) continue;
      
      if (!mechanicMap.has(mechanicId)) {
        mechanicMap.set(mechanicId, {
          mechanicId,
          totalServices: 0,
          totalDuration: 0,
          services: []
        });
      }
      
      const data = mechanicMap.get(mechanicId);
      data.totalServices++;
      data.totalDuration += exec.durationMinutes || 0;
      data.services.push({
        serviceId: exec.serviceId,
        serviceName: exec.service?.name,
        duration: exec.durationMinutes
      });
    }
    
    const result = [];
    for (const [_, data] of mechanicMap) {
      result.push({
        mechanicId: data.mechanicId,
        totalServices: data.totalServices,
        totalHours: (data.totalDuration / 60).toFixed(2),
        averagePerService: (data.totalDuration / data.totalServices).toFixed(2),
        services: data.services
      });
    }
    
    return result;
  }
}