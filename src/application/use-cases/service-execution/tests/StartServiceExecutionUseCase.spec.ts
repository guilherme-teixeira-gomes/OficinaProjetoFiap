import { ServiceExecutionRepository } from "../../../../infrastructure/repositories/ServiceExecutionRepository";
import { StartServiceExecutionUseCase } from "../StartServiceExecutionUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
  ServiceExecutionRepository: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }
}));

describe("StartServiceExecutionUseCase", () => {
  let startServiceUseCase: StartServiceExecutionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    startServiceUseCase = new StartServiceExecutionUseCase();
  });

  describe("execute", () => {
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

      const result = await startServiceUseCase.execute({
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

      const result = await startServiceUseCase.execute({
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
        startServiceUseCase.execute({
          serviceOrderId: 1,
          serviceId: 10
        })
      ).rejects.toThrow("Este serviço já foi concluído");
    });
  });
});