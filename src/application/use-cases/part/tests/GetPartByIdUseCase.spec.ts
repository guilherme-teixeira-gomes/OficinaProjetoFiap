import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { GetPartByIdUseCase } from "../GetPartByIdUseCase";


jest.mock("../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    findOne: jest.fn(),
  }
}));

describe("GetPartByIdUseCase", () => {
  let getPartByIdUseCase: GetPartByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getPartByIdUseCase = new GetPartByIdUseCase();
  });

  it("deve buscar peça por id", async () => {
    const mockPart = { id: 1, name: "Filtro", price: 50 };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(mockPart);

    const result = await getPartByIdUseCase.getById(1);

    expect(result).toHaveProperty("id", 1);
  });

  it("deve retornar null se peça não existir", async () => {
    (PartRepository.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getPartByIdUseCase.getById(999);

    expect(result).toBeNull();
  });
});