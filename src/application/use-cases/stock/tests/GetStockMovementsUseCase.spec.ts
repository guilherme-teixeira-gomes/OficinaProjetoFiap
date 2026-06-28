import { GetStockMovementsUseCase } from "../GetStockMovementsUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetStockMovementsUseCase", () => {
  let useCase: GetStockMovementsUseCase;
  let mockRepo: any;
  let mockQb: any;

  beforeEach(() => {
    mockQb = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn()
    };
    mockRepo = { createQueryBuilder: jest.fn().mockReturnValue(mockQb) };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetStockMovementsUseCase();
  });

  it("deve retornar todas as movimentações sem filtros", async () => {
    mockQb.getMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });

  it("deve filtrar por partId", async () => {
    mockQb.getMany.mockResolvedValue([{ id: 1, partId: 1 }]);
    const result = await useCase.execute({ partId: 1 });
    expect(mockQb.andWhere).toHaveBeenCalledWith("movement.partId = :partId", { partId: 1 });
  });

  it("deve filtrar por serviceOrderId", async () => {
    mockQb.getMany.mockResolvedValue([{ id: 1 }]);
    const result = await useCase.execute({ serviceOrderId: 5 });
    expect(mockQb.andWhere).toHaveBeenCalledWith("movement.serviceOrderId = :serviceOrderId", { serviceOrderId: 5 });
  });

  it("deve filtrar por período", async () => {
    mockQb.getMany.mockResolvedValue([]);
    const start = new Date("2024-01-01");
    const end = new Date("2024-12-31");
    await useCase.execute({ startDate: start, endDate: end });
    expect(mockQb.andWhere).toHaveBeenCalledWith("movement.createdAt >= :startDate", { startDate: start });
    expect(mockQb.andWhere).toHaveBeenCalledWith("movement.createdAt <= :endDate", { endDate: end });
  });

  it("deve filtrar por tipo", async () => {
    mockQb.getMany.mockResolvedValue([]);
    await useCase.execute({ type: "IN" });
    expect(mockQb.andWhere).toHaveBeenCalledWith("movement.type = :type", { type: "IN" });
  });

  it("deve aplicar múltiplos filtros simultaneamente", async () => {
    mockQb.getMany.mockResolvedValue([]);
    await useCase.execute({ partId: 1, type: "OUT" });
    expect(mockQb.andWhere).toHaveBeenCalledTimes(2);
  });
});