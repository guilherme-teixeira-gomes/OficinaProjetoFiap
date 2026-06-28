import { GetPartByIdUseCase } from "../GetPartByIdUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetPartByIdUseCase", () => {
  let useCase: GetPartByIdUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetPartByIdUseCase();
  });

  it("deve buscar peça por id", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, name: "Filtro" });
    const result = await useCase.getById(1);
    expect(result).toHaveProperty("id", 1);
  });

  it("deve retornar null se peça não existir", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await useCase.getById(999);
    expect(result).toBeNull();
  });
});