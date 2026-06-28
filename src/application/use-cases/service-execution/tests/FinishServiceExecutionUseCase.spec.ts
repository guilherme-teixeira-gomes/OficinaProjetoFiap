import { FinishServiceExecutionUseCase } from "../FinishServiceExecutionUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("FinishServiceExecutionUseCase", () => {
  let useCase: FinishServiceExecutionUseCase;
  let mockExecutionRepo: any;
  let mockOrderRepo: any;

  beforeEach(() => {
    mockExecutionRepo = { findOne: jest.fn(), find: jest.fn(), save: jest.fn() };
    mockOrderRepo = { findOne: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockExecutionRepo)
      .mockImplementationOnce(() => mockOrderRepo);
    useCase = new FinishServiceExecutionUseCase();
  });

  it("deve finalizar serviço", async () => {
    const mockExecution = { id: 1, status: "EM_ANDAMENTO", startedAt: new Date(Date.now() - 60000), serviceOrderId: 1, serviceId: 1 };
    mockExecutionRepo.findOne.mockResolvedValue(mockExecution);
    mockExecutionRepo.find.mockResolvedValue([{ ...mockExecution, status: "CONCLUIDO" }]);
    mockExecutionRepo.save.mockResolvedValue({ ...mockExecution, status: "CONCLUIDO" });
    mockOrderRepo.findOne.mockResolvedValue({ id: 1, status: "EM_EXECUCAO" });
    mockOrderRepo.save.mockResolvedValue({});

    const result = await useCase.execute({ serviceOrderId: 1, serviceId: 1 });
    expect(result).toHaveProperty("status", "CONCLUIDO");
  });

  it("deve dar erro se serviço já concluído", async () => {
    mockExecutionRepo.findOne.mockResolvedValue({ id: 1, status: "CONCLUIDO" });
    await expect(useCase.execute({ serviceOrderId: 1, serviceId: 1 })).rejects.toThrow("Serviço já foi concluído");
  });

  it("deve finalizar ordem quando todos os serviços estão concluídos", async () => {
    const mockExecution = { id: 1, status: "EM_ANDAMENTO", startedAt: new Date(Date.now() - 60000), serviceOrderId: 1, serviceId: 1 };
    mockExecutionRepo.findOne.mockResolvedValue(mockExecution);
    mockExecutionRepo.find.mockResolvedValue([{ status: "CONCLUIDO" }]);
    mockExecutionRepo.save.mockResolvedValue({ ...mockExecution, status: "CONCLUIDO" });
    mockOrderRepo.findOne.mockResolvedValue({ id: 1, status: "EM_EXECUCAO" });
    mockOrderRepo.save.mockResolvedValue({ id: 1, status: "FINALIZADA" });

    await useCase.execute({ serviceOrderId: 1, serviceId: 1 });
    expect(mockOrderRepo.save).toHaveBeenCalledWith(expect.objectContaining({ status: "FINALIZADA" }));
  });
});