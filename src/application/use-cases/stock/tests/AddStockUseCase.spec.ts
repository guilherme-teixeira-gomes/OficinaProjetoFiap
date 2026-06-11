import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { StockMovementRepository } from "../../../../infrastructure/repositories/StockMovementRepository";
import { AddStockUseCase } from "../AddStockUseCase";

jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

jest.mock("../../../../infrastructure/repositories/StockMovementRepository", () => ({
  StockMovementRepository: {
    create: jest.fn(),
    save: jest.fn(),
  }
}));

describe("AddStockUseCase", () => {
  let addStockUseCase: AddStockUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    addStockUseCase = new AddStockUseCase();
  });

  it("deve adicionar estoque com sucesso", async () => {
    const mockPart = {
      id: 1,
      name: "Filtro de óleo",
      price: 50,
      stock: 10
    };

    const mockMovement = {
      id: 1,
      partId: 1,
      partName: "Filtro de óleo",
      quantity: 5,
      type: "IN",
      unitPrice: 50,
      totalValue: 250,
      description: "Entrada de estoque",
      status: "CONFIRMADO"
    };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(mockPart);
    (PartRepository.save as jest.Mock).mockResolvedValue({ ...mockPart, stock: 15 });
    (StockMovementRepository.create as jest.Mock).mockReturnValue(mockMovement);
    (StockMovementRepository.save as jest.Mock).mockResolvedValue(mockMovement);

    const result = await addStockUseCase.execute(1, 5);

    expect(result).toHaveProperty("id", 1);
    expect(PartRepository.save).toHaveBeenCalledWith({ ...mockPart, stock: 15 });
    expect(StockMovementRepository.save).toHaveBeenCalled();
  });

  it("deve lançar erro se peça não for encontrada", async () => {
    (PartRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(addStockUseCase.execute(999, 5)).rejects.toThrow("Peça não encontrada");
  });

  it("deve usar descrição personalizada quando fornecida", async () => {
    const mockPart = {
      id: 1,
      name: "Filtro de óleo",
      price: 50,
      stock: 10
    };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(mockPart);
    (PartRepository.save as jest.Mock).mockResolvedValue({ ...mockPart, stock: 15 });
    (StockMovementRepository.create as jest.Mock).mockReturnValue({});
    (StockMovementRepository.save as jest.Mock).mockResolvedValue({});

    await addStockUseCase.execute(1, 5, "Compra realizada");

    expect(StockMovementRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Compra realizada"
      })
    );
  });
});