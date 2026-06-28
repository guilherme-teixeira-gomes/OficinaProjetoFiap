import { GetCriticalStockUseCase } from "../GetCriticalStockUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetCriticalStockUseCase", () => {
  let useCase: GetCriticalStockUseCase;
  let mockRepo: any;

  beforeEach(() => {
    const mockQb = { where: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(), getMany: jest.fn() };
    mockRepo = { createQueryBuilder: jest.fn().mockReturnValue(mockQb) };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetCriticalStockUseCase();
  });

  it("deve retornar peças com estoque crítico", async () => {
    const mockQb = mockRepo.createQueryBuilder();
    mockQb.getMany.mockResolvedValue([{ id: 1, stock: 2, minimumStock: 5 }]);

    const result = await useCase.execute();
    expect(result).toHaveLength(1);
  });

  it("deve retornar array vazio quando não há peças críticas", async () => {
    const mockQb = mockRepo.createQueryBuilder();
    mockQb.getMany.mockResolvedValue([]);

    const result = await useCase.execute();
    expect(result).toHaveLength(0);
  });
});