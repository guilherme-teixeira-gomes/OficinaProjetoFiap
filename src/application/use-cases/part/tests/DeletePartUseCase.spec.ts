import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { DeletePartUseCase } from "../DeletePartUseCase";


jest.mock("../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    findOne: jest.fn(),
    remove: jest.fn(),
  }
}));

describe("DeletePartUseCase", () => {
  let deletePartUseCase: DeletePartUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    deletePartUseCase = new DeletePartUseCase();
  });

  it("deve deletar peça com sucesso", async () => {
    const existingPart = { id: 1, name: "Filtro" };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(existingPart);
    (PartRepository.remove as jest.Mock).mockResolvedValue(existingPart);

    const result = await deletePartUseCase.delete(1);

    expect(result).toHaveProperty("id", 1);
    expect(PartRepository.remove).toHaveBeenCalledWith(existingPart);
  });

  it("deve dar erro ao deletar peça inexistente", async () => {
    (PartRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(deletePartUseCase.delete(1)).rejects.toThrow("Peça não encontrada");
  });
});