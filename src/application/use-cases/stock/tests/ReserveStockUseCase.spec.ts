import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { StockMovementRepository } from "../../../../infrastructure/repositories/StockMovementRepository";
import { ReserveStockUseCase } from "../ReserveStockUseCase";


jest.mock("../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

jest.mock("../../../infrastructure/repositories/StockMovementRepository", () => ({
  StockMovementRepository: {
    create: jest.fn(),
    save: jest.fn(),
  }
}));

describe("ReserveStockUseCase", () => {
  let reserveStockUseCase: ReserveStockUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    reserveStockUseCase = new ReserveStockUseCase();
  });

  it("deve reservar estoque com sucesso", async () => {
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
      quantity: -3,
      type: "OUT",
      unitPrice: 50,
      totalValue: 150,
      serviceOrderId: 100,
      description: "Baixa para OS #100 - Filtro de óleo (3 unidade(s))",
      status: "CONFIRMADO"
    };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(mockPart);
    (PartRepository.save as jest.Mock).mockResolvedValue({ ...mockPart, stock: 7 });
    (StockMovementRepository.create as jest.Mock).mockReturnValue(mockMovement);
    (StockMovementRepository.save as jest.Mock).mockResolvedValue(mockMovement);

    const result = await reserveStockUseCase.execute(1, 3, 100);

    expect(result).toHaveProperty("id", 1);
    expect(PartRepository.save).toHaveBeenCalledWith({ ...mockPart, stock: 7 });
  });

  it("deve lançar erro se peça não for encontrada", async () => {
    (PartRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(reserveStockUseCase.execute(999, 5, 100)).rejects.toThrow(
      "Peça não encontrada"
    );
  });

  it("deve lançar erro se estoque for insuficiente", async () => {
    const mockPart = {
      id: 1,
      name: "Filtro de óleo",
      stock: 2
    };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(mockPart);

    await expect(reserveStockUseCase.execute(1, 5, 100)).rejects.toThrow(
      "Estoque insuficiente para Filtro de óleo"
    );
  });

  it("deve usar descrição personalizada quando fornecida", async () => {
    const mockPart = {
      id: 1,
      name: "Filtro de óleo",
      price: 50,
      stock: 10
    };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(mockPart);
    (PartRepository.save as jest.Mock).mockResolvedValue({ ...mockPart, stock: 7 });
    (StockMovementRepository.create as jest.Mock).mockReturnValue({});
    (StockMovementRepository.save as jest.Mock).mockResolvedValue({});

    await reserveStockUseCase.execute(1, 3, 100, "Reserva personalizada");

    expect(StockMovementRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Reserva personalizada"
      })
    );
  });
});