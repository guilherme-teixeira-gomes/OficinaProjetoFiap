import { UpdatePartUseCase } from "../UpdatePartUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("UpdatePartUseCase", () => {
  let useCase: UpdatePartUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), merge: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new UpdatePartUseCase();
  });

  it("deve atualizar peça com sucesso", async () => {
    const mockPart = { id: 1, name: "Filtro", price: 50 };
    mockRepo.findOne.mockResolvedValue(mockPart);
    mockRepo.save.mockResolvedValue({ ...mockPart, price: 60 });

    const result = await useCase.update(1, { price: 60 });
    expect(mockRepo.merge).toHaveBeenCalledWith(mockPart, { price: 60 });
  });

  it("deve dar erro ao atualizar peça inexistente", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(useCase.update(999, { price: 60 })).rejects.toThrow("Peça não encontrada");
  });
});