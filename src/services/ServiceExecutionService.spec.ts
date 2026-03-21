import { ServiceExecutionService } from "./ServiceExecutionService";
import { ServiceExecutionRepository } from "../repositories/ServiceExecutionRepository";
import { ServiceOrderRepository } from "../repositories/ServiceOrderRepository";

jest.mock("../repositories/ServiceExecutionRepository", () => ({
  ServiceExecutionRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
  }
}));

jest.mock("../repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

describe("ServiceExecutionService", () => {
  let serviceExecutionService: ServiceExecutionService;

  beforeEach(() => {
    jest.clearAllMocks();
    serviceExecutionService = new ServiceExecutionService();
  });

  describe("createExecutionsFromApprovedOrder", () => {
    it("deve criar execuções a partir da ordem aprovada", async () => {
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        services: [{ id: 10 }, { id: 20 }]
      });

      (ServiceExecutionRepository.findOne as jest.Mock).mockResolvedValue(null);
      (ServiceExecutionRepository.save as jest.Mock).mockResolvedValue({});

      await serviceExecutionService.createExecutionsFromApprovedOrder(1);

      expect(ServiceExecutionRepository.save).toHaveBeenCalledTimes(2);
    });

    it("deve lançar erro se ordem não existir", async () => {
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        serviceExecutionService.createExecutionsFromApprovedOrder(1)
      ).rejects.toThrow("Ordem não encontrada");
    });

    it("não deve criar execuções duplicadas", async () => {
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        services: [{ id: 10 }, { id: 20 }]
      });

      (ServiceExecutionRepository.findOne as jest.Mock)
        .mockResolvedValueOnce({ id: 1 }) // primeira execução já existe
        .mockResolvedValueOnce(null); // segunda execução não existe

      (ServiceExecutionRepository.save as jest.Mock).mockResolvedValue({});

      await serviceExecutionService.createExecutionsFromApprovedOrder(1);

      expect(ServiceExecutionRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("startService", () => {
    it("deve iniciar serviço novo", async () => {
      (ServiceExecutionRepository.findOne as jest.Mock).mockResolvedValue(null);
      (ServiceExecutionRepository.create as jest.Mock).mockReturnValue({
        serviceOrderId: 1,
        serviceId: 10,
        status: "EM_ANDAMENTO",
        startedAt: expect.any(Date)
      });
      (ServiceExecutionRepository.save as jest.Mock).mockResolvedValue({
        id: 1,
        status: "EM_ANDAMENTO"
      });

      const result = await serviceExecutionService.startService({
        serviceOrderId: 1,
        serviceId: 10
      });

      expect(result.status).toBe("EM_ANDAMENTO");
    });

    it("deve iniciar serviço pendente existente", async () => {
      const existingExecution = {
        id: 1,
        status: "PENDENTE",
        startedAt: null
      };

      (ServiceExecutionRepository.findOne as jest.Mock).mockResolvedValue(existingExecution);
      (ServiceExecutionRepository.save as jest.Mock).mockResolvedValue({
        ...existingExecution,
        status: "EM_ANDAMENTO",
        startedAt: expect.any(Date)
      });

      const result = await serviceExecutionService.startService({
        serviceOrderId: 1,
        serviceId: 10
      });

      expect(result.status).toBe("EM_ANDAMENTO");
    });

    it("deve dar erro se serviço já concluído", async () => {
      (ServiceExecutionRepository.findOne as jest.Mock).mockResolvedValue({
        status: "CONCLUIDO"
      });

      await expect(
        serviceExecutionService.startService({
          serviceOrderId: 1,
          serviceId: 10
        })
      ).rejects.toThrow("Este serviço já foi concluído");
    });
  });

  describe("finishService", () => {
    it("deve finalizar serviço", async () => {
      const mockExecution = {
        id: 1,
        status: "EM_ANDAMENTO",
        startedAt: new Date(Date.now() - 60000),
        serviceOrderId: 1,
        serviceId: 10
      };

      (ServiceExecutionRepository.findOne as jest.Mock).mockResolvedValue(mockExecution);
      (ServiceExecutionRepository.save as jest.Mock).mockResolvedValue({
        ...mockExecution,
        status: "CONCLUIDO",
        finishedAt: expect.any(Date),
        durationMinutes: 1
      });
      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([
        { status: "CONCLUIDO" }
      ]);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        status: "EM_EXECUCAO"
      });
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});

      const result = await serviceExecutionService.finishService({
        serviceOrderId: 1,
        serviceId: 10,
        mechanicNote: "Serviço concluído"
      });

      expect(result.status).toBe("CONCLUIDO");
    });

    it("deve dar erro se execução não encontrada", async () => {
      (ServiceExecutionRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        serviceExecutionService.finishService({
          serviceOrderId: 1,
          serviceId: 10
        })
      ).rejects.toThrow("Execução não encontrada");
    });

    it("deve dar erro se serviço já concluído", async () => {
      (ServiceExecutionRepository.findOne as jest.Mock).mockResolvedValue({
        status: "CONCLUIDO"
      });

      await expect(
        serviceExecutionService.finishService({
          serviceOrderId: 1,
          serviceId: 10
        })
      ).rejects.toThrow("Serviço já foi concluído");
    });
  });

  describe("getAverageTimeByService", () => {
    it("deve calcular média de tempo", async () => {
      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([
        { durationMinutes: 60 },
        { durationMinutes: 30 }
      ]);

      const result = await serviceExecutionService.getAverageTimeByService(1);

      expect(result.averageMinutes).toBe(45);
      expect(result.totalExecutions).toBe(2);
      expect(result.minMinutes).toBe(30);
      expect(result.maxMinutes).toBe(60);
    });

    it("deve retornar média zero quando não há execuções", async () => {
      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await serviceExecutionService.getAverageTimeByService(1);

      expect(result.averageMinutes).toBe(0);
      expect(result.totalExecutions).toBe(0);
    });
  });

  describe("getAllServicesAverage", () => {
    it("deve calcular média de todos os serviços", async () => {
      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([
        { serviceId: 1, durationMinutes: 60, service: { id: 1, name: "Troca de óleo" } },
        { serviceId: 1, durationMinutes: 30, service: { id: 1, name: "Troca de óleo" } },
        { serviceId: 2, durationMinutes: 90, service: { id: 2, name: "Alinhamento" } }
      ]);

      const result = await serviceExecutionService.getAllServicesAverage();

      expect(result).toHaveLength(2);
      expect(result[0].averageMinutes).toBe(45);
      expect(result[1].averageMinutes).toBe(90);
    });
  });

  describe("getServiceOrderTimeline", () => {
    it("deve buscar timeline da ordem", async () => {
      const mockExecutions = [
        { 
          serviceId: 1, 
          service: { id: 1, name: "Troca de óleo" },
          status: "CONCLUIDO",
          startedAt: new Date(),
          finishedAt: new Date(),
          durationMinutes: 60,
          mechanicNote: "OK"
        }
      ];

      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue(mockExecutions);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        status: "FINALIZADA",
        startedAt: new Date(),
        finishedAt: new Date()
      });

      const result = await serviceExecutionService.getServiceOrderTimeline(1);

      expect(result.serviceOrder).toHaveProperty("id", 1);
      expect(result.services).toHaveLength(1);
    });
  });

  describe("getExecutionsByPeriod", () => {
    it("deve buscar execuções por período", async () => {
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-01-31");
      const mockExecutions = [{ 
        id: 1, 
        status: "CONCLUIDO",
        service: { id: 1, name: "Troca de óleo" },
        serviceOrder: { id: 1, mechanic: { id: 1 } }
      }];

      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue(mockExecutions);

      const result = await serviceExecutionService.getExecutionsByPeriod(startDate, endDate);

      expect(result).toHaveLength(1);
      expect(ServiceExecutionRepository.find).toHaveBeenCalled();
    });
  });

  describe("getProductivityReport", () => {
    it("deve gerar relatório de produtividade", async () => {
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-01-31");
      
      // Mock completo das execuções com todas as propriedades necessárias
      const mockExecutions = [
        { 
          id: 1,
          serviceOrderId: 1,
          serviceId: 1,
          durationMinutes: 60,
          status: "CONCLUIDO",
          startedAt: new Date(),
          finishedAt: new Date(),
          service: { id: 1, name: "Troca de óleo" },
          serviceOrder: { 
            id: 1, 
            mechanicId: 1,
            mechanic: { id: 1, name: "João" }
          }
        },
        { 
          id: 2,
          serviceOrderId: 2,
          serviceId: 1,
          durationMinutes: 30,
          status: "CONCLUIDO",
          startedAt: new Date(),
          finishedAt: new Date(),
          service: { id: 1, name: "Troca de óleo" },
          serviceOrder: { 
            id: 2, 
            mechanicId: 1,
            mechanic: { id: 1, name: "João" }
          }
        }
      ];

      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue(mockExecutions);

      const result = await serviceExecutionService.getProductivityReport(startDate, endDate);

      expect(result).toHaveLength(1);
      expect(result[0].totalServices).toBe(2);
      expect(result[0].mechanicId).toBe(1);
    });

    it("deve gerar relatório vazio quando não há execuções", async () => {
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-01-31");

      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await serviceExecutionService.getProductivityReport(startDate, endDate);

      expect(result).toEqual([]);
    });
  });
});