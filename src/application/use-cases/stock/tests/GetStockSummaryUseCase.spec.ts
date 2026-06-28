import { GetStockSummaryUseCase } from "../GetStockSummaryUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetStockSummaryUseCase", () => {
  let useCase: GetStockSummaryUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetStockSummaryUseCase();
  });

  it("deve retornar resumo do estoque corretamente", async () => {
    mockRepo.find.mockResolvedValue([
      { id: 1, name: "Filtro", price: 50, stock: 10, minimumStock: 5 },
      { id: 2, name: "Óleo", price: 30, stock: 3, minimumStock: 5 }
    ]);

    const result = await useCase.execute();
    expect(result.totalParts).toBe(2);
    expect(result.totalValue).toBe(590);
  });

  it("deve retornar resumo vazio quando não há peças", async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result.totalParts).toBe(0);
    expect(result.totalValue).toBe(0);
  });
});