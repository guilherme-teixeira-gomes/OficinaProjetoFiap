import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { CreatePartUseCase } from "../CreatePartUseCase";


jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    create: jest.fn(),
    save: jest.fn(),
  }
}));

describe("CreatePartUseCase", () => {
  let createPartUseCase: CreatePartUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createPartUseCase = new CreatePartUseCase();
  });

  it("deve criar peça com sucesso", async () => {
    const mockPart = { id: 1, name: "Filtro de óleo", price: 50 };

    (PartRepository.create as jest.Mock).mockReturnValue(mockPart);
    (PartRepository.save as jest.Mock).mockResolvedValue(mockPart);

    const result = await createPartUseCase.create({
      name: "Filtro de óleo",
      price: 50
    });

    expect(result).toHaveProperty("id", 1);
    expect(result.name).toBe("Filtro de óleo");
  });

  it("deve criar peça com descrição e estoque", async () => {
    const mockPart = { id: 1, name: "Pastilha de freio", description: "Pastilha dianteira", price: 80, stock: 10 };

    (PartRepository.create as jest.Mock).mockReturnValue(mockPart);
    (PartRepository.save as jest.Mock).mockResolvedValue(mockPart);

    const result = await createPartUseCase.create({
      name: "Pastilha de freio",
      description: "Pastilha dianteira",
      price: 80,
      stock: 10
    });

    expect(result.stock).toBe(10);
    expect(result.description).toBe("Pastilha dianteira");
  });
});