import { StartServiceExecutionUseCase } from "../StartServiceExecutionUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("StartServiceExecutionUseCase", () => {
  let useCase: StartServiceExecutionUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new StartServiceExecutionUseCase();
  });

  it("deve iniciar serviço novo", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const mockExecution = { id: 1, status: "EM_ANDAMENTO" };
    mockRepo.create.mockReturnValue(mockExecution);
    mockRepo.save.mockResolvedValue(mockExecution);

    const result = await useCase.execute({ serviceOrderId: 1, serviceId: 1 });
    expect(result).toHaveProperty("status", "EM_ANDAMENTO");
  });

  it("deve iniciar serviço pendente existente", async () => {
    const mockExecution = { id: 1, status: "PENDENTE", startedAt: null };
    mockRepo.findOne.mockResolvedValue(mockExecution);
    mockRepo.save.mockResolvedValue({ ...mockExecution, status: "EM_ANDAMENTO" });

    const result = await useCase.execute({ serviceOrderId: 1, serviceId: 1 });
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it("deve dar erro se serviço já concluído", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, status: "CONCLUIDO" });
    await expect(useCase.execute({ serviceOrderId: 1, serviceId: 1 })).rejects.toThrow("Este serviço já foi concluído");
  });
});