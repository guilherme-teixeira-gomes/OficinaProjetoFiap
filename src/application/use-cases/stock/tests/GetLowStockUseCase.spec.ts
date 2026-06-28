import { GetLowStockUseCase } from "../GetLowStockUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetLowStockUseCase", () => {
  let useCase: GetLowStockUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetLowStockUseCase();
  });

  it("deve retornar peças com estoque baixo", async () => {
    mockRepo.find.mockResolvedValue([{ id: 1, stock: 2 }]);
    const result = await useCase.execute();
    expect(result).toHaveLength(1);
  });

  it("deve retornar array vazio quando não há peças com baixo estoque", async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result).toHaveLength(0);
  });
});