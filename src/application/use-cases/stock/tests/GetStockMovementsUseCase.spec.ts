import { StockMovementRepository } from "../../../../infrastructure/repositories/StockMovementRepository";
import { GetStockMovementsUseCase } from "../GetStockMovementsUseCase";


jest.mock("../../../infrastructure/repositories/StockMovementRepository", () => ({
  StockMovementRepository: {
    createQueryBuilder: jest.fn(),
  }
}));

describe("GetStockMovementsUseCase", () => {
  let getStockMovementsUseCase: GetStockMovementsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getStockMovementsUseCase = new GetStockMovementsUseCase();
  });

  it("deve retornar todas as movimentações sem filtros", async () => {
    const mockMovements = [
      { id: 1, partId: 1, quantity: 5, type: "IN", createdAt: new Date() },
      { id: 2, partId: 2, quantity: 3, type: "OUT", createdAt: new Date() }
    ];

    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockMovements)
    };

    (StockMovementRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    const result = await getStockMovementsUseCase.execute();

    expect(result).toHaveLength(2);
  });

  it("deve filtrar por partId", async () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([])
    };

    (StockMovementRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    await getStockMovementsUseCase.execute({ partId: 1 });

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "movement.partId = :partId",
      { partId: 1 }
    );
  });

  it("deve filtrar por serviceOrderId", async () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([])
    };

    (StockMovementRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    await getStockMovementsUseCase.execute({ serviceOrderId: 10 });

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "movement.serviceOrderId = :serviceOrderId",
      { serviceOrderId: 10 }
    );
  });

  it("deve filtrar por período", async () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-01-31");
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([])
    };

    (StockMovementRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    await getStockMovementsUseCase.execute({ startDate, endDate });

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "movement.createdAt >= :startDate",
      { startDate }
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "movement.createdAt <= :endDate",
      { endDate }
    );
  });

  it("deve filtrar por tipo", async () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([])
    };

    (StockMovementRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    await getStockMovementsUseCase.execute({ type: "IN" });

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      "movement.type = :type",
      { type: "IN" }
    );
  });

  it("deve aplicar múltiplos filtros simultaneamente", async () => {
    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-01-31");
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([])
    };

    (StockMovementRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

    await getStockMovementsUseCase.execute({
      partId: 1,
      serviceOrderId: 10,
      startDate,
      endDate,
      type: "OUT"
    });

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(4);
  });
});