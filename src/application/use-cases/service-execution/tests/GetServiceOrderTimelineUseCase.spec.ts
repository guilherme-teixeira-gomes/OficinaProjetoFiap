import { ServiceExecutionRepository } from "../../../../infrastructure/repositories/ServiceExecutionRepository";
import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { GetServiceOrderTimelineUseCase } from "../GetServiceOrderTimelineUseCase";


jest.mock("../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
  ServiceExecutionRepository: {
    find: jest.fn(),
  }
}));

jest.mock("../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
  }
}));

describe("GetServiceOrderTimelineUseCase", () => {
  let getTimelineUseCase: GetServiceOrderTimelineUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getTimelineUseCase = new GetServiceOrderTimelineUseCase();
  });

  describe("execute", () => {
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
        },
        { 
          serviceId: 2, 
          service: { id: 2, name: "Alinhamento" },
          status: "EM_ANDAMENTO",
          startedAt: new Date(),
          finishedAt: null,
          durationMinutes: null,
          mechanicNote: null
        }
      ];

      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue(mockExecutions);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        status: "EM_EXECUCAO",
        startedAt: new Date(),
        finishedAt: null
      });

      const result = await getTimelineUseCase.execute(1);

      expect(result.serviceOrder).toHaveProperty("id", 1);
      expect(result.services).toHaveLength(2);
      expect(result.services[0].serviceName).toBe("Troca de óleo");
      expect(result.services[1].status).toBe("EM_ANDAMENTO");
    });

    it("deve calcular duração total quando ordem finalizada", async () => {
      const startDate = new Date("2024-01-01T10:00:00");
      const endDate = new Date("2024-01-01T12:30:00");

      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([]);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        status: "FINALIZADA",
        startedAt: startDate,
        finishedAt: endDate
      });

      const result = await getTimelineUseCase.execute(1);

      expect(result.serviceOrder.totalDuration).toBe(150); // 2.5 horas = 150 minutos
    });
  });
});