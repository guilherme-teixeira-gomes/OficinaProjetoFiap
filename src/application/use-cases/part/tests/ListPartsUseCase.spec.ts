import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { ListPartsUseCase } from "../ListPartsUseCase";


jest.mock("../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    find: jest.fn(),
  }
}));

describe("ListPartsUseCase", () => {
  let listPartsUseCase: ListPartsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listPartsUseCase = new ListPartsUseCase();
  });

  it("deve listar todas as peças", async () => {
    const mockParts = [
      { id: 1, name: "Filtro", price: 50 },
      { id: 2, name: "Pastilha", price: 80 }
    ];

    (PartRepository.find as jest.Mock).mockResolvedValue(mockParts);

    const result = await listPartsUseCase.list();

    expect(result).toHaveLength(2);
  });

  it("deve retornar array vazio quando não há peças", async () => {
    (PartRepository.find as jest.Mock).mockResolvedValue([]);

    const result = await listPartsUseCase.list();

    expect(result).toEqual([]);
  });
});