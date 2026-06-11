import { RestoreStockUseCase } from "../RestoreStockUseCase";
import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { StockMovementRepository } from "../../../../infrastructure/repositories/StockMovementRepository";

jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
}));

jest.mock("../../../../infrastructure/repositories/StockMovementRepository", () => ({
  StockMovementRepository: {
    create: jest.fn(),
    save: jest.fn(),
  },
}));

describe("RestoreStockUseCase", () => {
  let useCase: RestoreStockUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RestoreStockUseCase();
  });

  it("deve restaurar estoque com sucesso", async () => {
    const part = { id: 1, name: "Filtro", stock: 5, price: 10 };
    (PartRepository.findOne as jest.Mock).mockResolvedValue(part);
    (PartRepository.save as jest.Mock).mockResolvedValue({ ...part, stock: 8 });
    (StockMovementRepository.create as jest.Mock).mockReturnValue({ id: 1 });
    (StockMovementRepository.save as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await useCase.execute(1, 3, 10);

    expect(PartRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(PartRepository.save).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it("deve lançar erro se peça não encontrada", async () => {
    (PartRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute(99, 3, 10)).rejects.toThrow("Peça não encontrada");
  });
});