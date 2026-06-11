import { ServiceExecutionRepository } from "../../../../infrastructure/repositories/ServiceExecutionRepository";
import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { CreateExecutionsFromApprovedOrderUseCase } from "../CreateExecutionsFromApprovedOrderUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
  }
}));

jest.mock("../../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
  ServiceExecutionRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

describe("CreateExecutionsFromApprovedOrderUseCase", () => {
  let createExecutionsUseCase: CreateExecutionsFromApprovedOrderUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createExecutionsUseCase = new CreateExecutionsFromApprovedOrderUseCase();
  });

  describe("execute", () => {
    it("deve criar execuções a partir da ordem aprovada", async () => {
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        services: [{ id: 10 }, { id: 20 }]
      });

      (ServiceExecutionRepository.findOne as jest.Mock).mockResolvedValue(null);
      (ServiceExecutionRepository.save as jest.Mock).mockResolvedValue({});

      await createExecutionsUseCase.execute(1);

      expect(ServiceExecutionRepository.save).toHaveBeenCalledTimes(2);
    });

    it("deve lançar erro se ordem não existir", async () => {
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        createExecutionsUseCase.execute(1)
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

      await createExecutionsUseCase.execute(1);

      expect(ServiceExecutionRepository.save).toHaveBeenCalledTimes(1);
    });
  });
});