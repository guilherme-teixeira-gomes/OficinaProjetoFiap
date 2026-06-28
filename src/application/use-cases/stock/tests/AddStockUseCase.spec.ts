import { AddStockUseCase } from "../AddStockUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("AddStockUseCase", () => {
  let useCase: AddStockUseCase;
  let mockPartRepo: any;
  let mockMovementRepo: any;

  beforeEach(() => {
    mockPartRepo = { findOne: jest.fn(), save: jest.fn() };
    mockMovementRepo = { create: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockPartRepo)
      .mockImplementationOnce(() => mockMovementRepo);
    useCase = new AddStockUseCase();
  });

  it("deve adicionar estoque com sucesso", async () => {
    const mockPart = { id: 1, name: "Filtro de óleo", price: 50, stock: 10 };
    const mockMovement = { id: 1, partId: 1, quantity: 5, type: "IN" };

    mockPartRepo.findOne.mockResolvedValue(mockPart);
    mockPartRepo.save.mockResolvedValue({ ...mockPart, stock: 15 });
    mockMovementRepo.create.mockReturnValue(mockMovement);
    mockMovementRepo.save.mockResolvedValue(mockMovement);

    const result = await useCase.execute(1, 5);
    expect(result).toHaveProperty("id", 1);
    expect(mockPartRepo.save).toHaveBeenCalledWith({ ...mockPart, stock: 15 });
  });

  it("deve lançar erro se peça não for encontrada", async () => {
    mockPartRepo.findOne.mockResolvedValue(null);
    await expect(useCase.execute(999, 5)).rejects.toThrow("Peça não encontrada");
  });

  it("deve usar descrição personalizada quando fornecida", async () => {
    const mockPart = { id: 1, name: "Filtro de óleo", price: 50, stock: 10 };
    mockPartRepo.findOne.mockResolvedValue(mockPart);
    mockPartRepo.save.mockResolvedValue({ ...mockPart, stock: 15 });
    mockMovementRepo.create.mockReturnValue({});
    mockMovementRepo.save.mockResolvedValue({});

    await useCase.execute(1, 5, "Compra realizada");
    expect(mockMovementRepo.create).toHaveBeenCalledWith(expect.objectContaining({ description: "Compra realizada" }));
  });
});