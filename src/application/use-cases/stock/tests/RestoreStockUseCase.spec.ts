import { RestoreStockUseCase } from "../RestoreStockUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("RestoreStockUseCase", () => {
  let useCase: RestoreStockUseCase;
  let mockPartRepo: any;
  let mockMovementRepo: any;

  beforeEach(() => {
    mockPartRepo = { findOne: jest.fn(), save: jest.fn() };
    mockMovementRepo = { create: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockPartRepo)
      .mockImplementationOnce(() => mockMovementRepo);
    useCase = new RestoreStockUseCase();
  });

  it("deve restaurar estoque com sucesso", async () => {
    const mockPart = { id: 1, name: "Filtro", price: 50, stock: 5 };
    mockPartRepo.findOne.mockResolvedValue(mockPart);
    mockPartRepo.save.mockResolvedValue({ ...mockPart, stock: 8 });
    mockMovementRepo.create.mockReturnValue({});
    mockMovementRepo.save.mockResolvedValue({});

    await useCase.execute(1, 3, 1);
    expect(mockPartRepo.save).toHaveBeenCalledWith({ ...mockPart, stock: 8 });
  });

  it("deve lançar erro se peça não encontrada", async () => {
    mockPartRepo.findOne.mockResolvedValue(null);
    await expect(useCase.execute(999, 3, 1)).rejects.toThrow("Peça não encontrada");
  });
});