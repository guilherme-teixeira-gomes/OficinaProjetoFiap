import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { UpdatePartUseCase } from "../UpdatePartUseCase";


jest.mock("../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    findOne: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
  }
}));

describe("UpdatePartUseCase", () => {
  let updatePartUseCase: UpdatePartUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    updatePartUseCase = new UpdatePartUseCase();
  });

  it("deve atualizar peça com sucesso", async () => {
    const existingPart = { id: 1, name: "Filtro antigo", price: 50 };
    const updatedPart = { ...existingPart, name: "Filtro novo", price: 60 };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(existingPart);
    (PartRepository.merge as jest.Mock).mockReturnValue(updatedPart);
    (PartRepository.save as jest.Mock).mockResolvedValue(updatedPart);

    const result = await updatePartUseCase.update(1, { name: "Filtro novo", price: 60 });

    expect(result.name).toBe("Filtro novo");
    expect(result.price).toBe(60);
    expect(PartRepository.merge).toHaveBeenCalledWith(existingPart, { name: "Filtro novo", price: 60 });
  });

  it("deve dar erro ao atualizar peça inexistente", async () => {
    (PartRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      updatePartUseCase.update(1, { name: "Teste" })
    ).rejects.toThrow("Peça não encontrada");
  });
});