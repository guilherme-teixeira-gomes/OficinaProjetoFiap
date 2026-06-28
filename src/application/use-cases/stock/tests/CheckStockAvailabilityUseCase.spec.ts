import { CheckStockAvailabilityUseCase } from "../CheckStockAvailabilityUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("CheckStockAvailabilityUseCase", () => {
  let useCase: CheckStockAvailabilityUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new CheckStockAvailabilityUseCase();
  });

  it("deve retornar disponível quando estoque é suficiente", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, stock: 10 });
    const result = await useCase.execute(1, 5);
    expect(result.available).toBe(true);
  });

  it("deve retornar indisponível quando estoque é insuficiente", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, stock: 3 });
    const result = await useCase.execute(1, 5);
    expect(result.available).toBe(false);
  });

  it("deve lançar erro se peça não for encontrada", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(useCase.execute(999, 5)).rejects.toThrow("Peça com ID 999 não encontrada");
  });
});