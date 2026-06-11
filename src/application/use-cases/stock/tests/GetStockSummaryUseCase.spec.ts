import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { GetStockSummaryUseCase } from "../GetStockSummaryUseCase";


jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    find: jest.fn(),
  }
}));

describe("GetStockSummaryUseCase", () => {
  let getStockSummaryUseCase: GetStockSummaryUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getStockSummaryUseCase = new GetStockSummaryUseCase();
  });

  it("deve retornar resumo do estoque corretamente", async () => {
    const mockParts = [
      { id: 1, name: "Peça A", price: 10, stock: 100, minimumStock: 20 },
      { id: 2, name: "Peça B", price: 20, stock: 5, minimumStock: 10 },
      { id: 3, name: "Peça C", price: 30, stock: 2, minimumStock: 5 },
      { id: 4, name: "Peça D", price: 40, stock: 8, minimumStock: 15 }
    ];

    (PartRepository.find as jest.Mock).mockResolvedValue(mockParts);

    const result = await getStockSummaryUseCase.execute();

    // Cálculo: (10*100) + (20*5) + (30*2) + (40*8) = 1000 + 100 + 60 + 320 = 1480
    expect(result.totalParts).toBe(4);
    expect(result.totalValue).toBe(1480);
    expect(result.partsByStock).toHaveLength(4);
    
    // Peça A: estoque normal
    expect(result.partsByStock[0].status).toBe("NORMAL");
    
    // Peça B: estoque baixo (5 < 10)
    expect(result.partsByStock[1].status).toBe("CRÍTICO");
    
    // Peça C: estoque crítico (2 <= 5)
    expect(result.partsByStock[2].status).toBe("CRÍTICO");
    
    // Peça D: estoque baixo (8 < 10, mas verifica minimumStock que é 15)
    // A lógica atual: stock <= minimumStock ? "CRÍTICO" : stock < 10 ? "BAIXO" : "NORMAL"
    expect(result.partsByStock[3].status).toBe("CRÍTICO");
  });

  it("deve retornar resumo vazio quando não há peças", async () => {
    (PartRepository.find as jest.Mock).mockResolvedValue([]);

    const result = await getStockSummaryUseCase.execute();

    expect(result.totalParts).toBe(0);
    expect(result.totalValue).toBe(0);
    expect(result.partsByStock).toEqual([]);
  });
});