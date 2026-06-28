import { DeleteServiceUseCase } from "../DeleteServiceUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("DeleteServiceUseCase", () => {
  let useCase: DeleteServiceUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), remove: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new DeleteServiceUseCase();
  });

  it("deve deletar serviço com sucesso", async () => {
    const mockService = { id: 1, name: "Troca de óleo" };
    mockRepo.findOne.mockResolvedValue(mockService);
    mockRepo.remove.mockResolvedValue(mockService);

    await useCase.delete(1);
    expect(mockRepo.remove).toHaveBeenCalledWith(mockService);
  });

  it("deve lançar erro ao deletar serviço inexistente", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(useCase.delete(999)).rejects.toThrow("Serviço não encontrado");
  });
});