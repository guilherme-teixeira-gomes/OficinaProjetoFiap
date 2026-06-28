import { DeletePartUseCase } from "../DeletePartUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("DeletePartUseCase", () => {
  let useCase: DeletePartUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), remove: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new DeletePartUseCase();
  });

  it("deve deletar peça com sucesso", async () => {
    const mockPart = { id: 1, name: "Filtro" };
    mockRepo.findOne.mockResolvedValue(mockPart);
    mockRepo.remove.mockResolvedValue(mockPart);

    const result = await useCase.delete(1);
    expect(mockRepo.remove).toHaveBeenCalledWith(mockPart);
  });

  it("deve dar erro ao deletar peça inexistente", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(useCase.delete(999)).rejects.toThrow("Peça não encontrada");
  });
});