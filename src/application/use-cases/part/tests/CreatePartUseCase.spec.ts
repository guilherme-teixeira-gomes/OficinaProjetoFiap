import { CreatePartUseCase } from "../CreatePartUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("CreatePartUseCase", () => {
  let useCase: CreatePartUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { create: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new CreatePartUseCase();
  });

  it("deve criar peça com sucesso", async () => {
    const mockPart = { id: 1, name: "Filtro", price: 50 };
    mockRepo.create.mockReturnValue(mockPart);
    mockRepo.save.mockResolvedValue(mockPart);

    const result = await useCase.create({ name: "Filtro", price: 50 });
    expect(result).toHaveProperty("id", 1);
  });

  it("deve criar peça com descrição e estoque", async () => {
    const mockPart = { id: 2, name: "Filtro", price: 50, stock: 10, description: "Desc" };
    mockRepo.create.mockReturnValue(mockPart);
    mockRepo.save.mockResolvedValue(mockPart);

    const result = await useCase.create({ name: "Filtro", price: 50, stock: 10, description: "Desc" });
    expect(result).toHaveProperty("stock", 10);
  });
});