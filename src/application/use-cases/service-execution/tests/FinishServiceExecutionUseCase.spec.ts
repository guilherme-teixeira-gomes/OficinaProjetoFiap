import { ServiceExecutionRepository } from "../../../../infrastructure/repositories/ServiceExecutionRepository";
import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { FinishServiceExecutionUseCase } from "../FinishServiceExecutionUseCase";


jest.mock("../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
  ServiceExecutionRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  }
}));

jest.mock("../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

describe("FinishServiceExecutionUseCase", () => {
  let finishServiceUseCase: FinishServiceExecutionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    finishServiceUseCase = new FinishServiceExecutionUseCase();
  });

  describe("execute", () => {
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

      const result = await finishServiceUseCase.execute({
        serviceOrderId: 1,
        serviceId: 10,
        mechanicNote: "Serviço concluído"
      });

      expect(result.status).toBe("CONCLUIDO");
    });

    it("deve dar erro se execução não encontrada", async () => {
      (ServiceExecutionRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        finishServiceUseCase.execute({
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
        finishServiceUseCase.execute({
          serviceOrderId: 1,
          serviceId: 10
        })
      ).rejects.toThrow("Serviço já foi concluído");
    });

    it("deve finalizar ordem quando todos os serviços estão concluídos", async () => {
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
      // Simula que todos os serviços foram concluídos
      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([
        { status: "CONCLUIDO" },
        { status: "CONCLUIDO" }
      ]);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        status: "EM_EXECUCAO"
      });
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});

      const result = await finishServiceUseCase.execute({
        serviceOrderId: 1,
        serviceId: 10,
        mechanicNote: "Serviço concluído"
      });

      expect(result.status).toBe("CONCLUIDO");
      expect(ServiceOrderRepository.save).toHaveBeenCalled();
    });
  });
});