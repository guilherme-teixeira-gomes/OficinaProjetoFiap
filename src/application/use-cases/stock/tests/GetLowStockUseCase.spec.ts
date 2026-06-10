import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { GetLowStockUseCase } from "../GetLowStockUseCase";


jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    find: jest.fn(),
  }
}));

jest.mock("typeorm", () => ({
  LessThan: jest.fn((value) => ({ operator: "<", value }))
}));

describe("GetLowStockUseCase", () => {
  let getLowStockUseCase: GetLowStockUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getLowStockUseCase = new GetLowStockUseCase();
  });

  it("deve retornar peças com estoque baixo (menos de 5)", async () => {
    const mockParts = [
      { id: 1, name: "Filtro de óleo", stock: 3 },
      { id: 2, name: "Pastilha de freio", stock: 1 },
      { id: 3, name: "Óleo de motor", stock: 4 }
    ];

    (PartRepository.find as jest.Mock).mockResolvedValue(mockParts);

    const result = await getLowStockUseCase.execute();

    expect(result).toHaveLength(3);
    expect(PartRepository.find).toHaveBeenCalledWith({
      where: { stock: expect.any(Object) },
      order: { stock: "ASC" }
    });
  });

  it("deve retornar array vazio quando não há peças com estoque baixo", async () => {
    (PartRepository.find as jest.Mock).mockResolvedValue([]);

    const result = await getLowStockUseCase.execute();

    expect(result).toEqual([]);
  });
});