import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { GetCriticalStockUseCase } from "../GetCriticalStockUseCase";


jest.mock("../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    createQueryBuilder: jest.fn(),
  }
}));

describe("GetCriticalStockUseCase", () => {
  let getCriticalStockUseCase: GetCriticalStockUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getCriticalStockUseCase = new GetCriticalStockUseCase();
  });

  it("deve retornar peças com estoque crítico", async () => {
    const mockParts = [
      { id: 1, name: "Filtro de óleo", stock: 2, minimumStock: 5 },
      { id: 2, name: "Pastilha de freio", stock: 0, minimumStock: 10 }
    ];

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockParts)
    };

    (PartRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    const result = await getCriticalStockUseCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Filtro de óleo");
    expect(result[1].name).toBe("Pastilha de freio");
    expect(mockQueryBuilder.where).toHaveBeenCalledWith("part.stock <= part.minimumStock");
  });

  it("deve retornar array vazio quando não há peças críticas", async () => {
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([])
    };

    (PartRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    const result = await getCriticalStockUseCase.execute();

    expect(result).toEqual([]);
  });
});