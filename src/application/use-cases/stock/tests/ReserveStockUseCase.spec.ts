import { ReserveStockUseCase } from "../ReserveStockUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("ReserveStockUseCase", () => {
  let useCase: ReserveStockUseCase;
  let mockPartRepo: any;
  let mockMovementRepo: any;

  beforeEach(() => {
    mockPartRepo = { findOne: jest.fn(), save: jest.fn() };
    mockMovementRepo = { create: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockPartRepo)
      .mockImplementationOnce(() => mockMovementRepo);
    useCase = new ReserveStockUseCase();
  });

  it("deve reservar estoque com sucesso", async () => {
    const mockPart = { id: 1, name: "Filtro de óleo", price: 50, stock: 10 };
    const mockMovement = { id: 1, partId: 1, quantity: -3, type: "OUT" };

    mockPartRepo.findOne.mockResolvedValue(mockPart);
    mockPartRepo.save.mockResolvedValue({ ...mockPart, stock: 7 });
    mockMovementRepo.create.mockReturnValue(mockMovement);
    mockMovementRepo.save.mockResolvedValue(mockMovement);

    const result = await useCase.execute(1, 3, 1);
    expect(mockPartRepo.save).toHaveBeenCalledWith({ ...mockPart, stock: 7 });
  });

  it("deve lançar erro se peça não for encontrada", async () => {
    mockPartRepo.findOne.mockResolvedValue(null);
    await expect(useCase.execute(999, 3, 1)).rejects.toThrow("Peça não encontrada");
  });

  it("deve lançar erro se estoque for insuficiente", async () => {
    mockPartRepo.findOne.mockResolvedValue({ id: 1, name: "Filtro de óleo", stock: 2 });
    await expect(useCase.execute(1, 5, 1)).rejects.toThrow("Estoque insuficiente para Filtro de óleo");
  });

  it("deve usar descrição personalizada quando fornecida", async () => {
    const mockPart = { id: 1, name: "Filtro", price: 50, stock: 10 };
    mockPartRepo.findOne.mockResolvedValue(mockPart);
    mockPartRepo.save.mockResolvedValue({ ...mockPart, stock: 7 });
    mockMovementRepo.create.mockReturnValue({});
    mockMovementRepo.save.mockResolvedValue({});

    await useCase.execute(1, 3, 1, "Baixa para OS");
    expect(mockMovementRepo.create).toHaveBeenCalledWith(expect.objectContaining({ description: "Baixa para OS" }));
  });
});