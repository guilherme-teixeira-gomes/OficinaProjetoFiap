import { GetServiceOrderByIdUseCase } from "../GetServiceOrderByIdUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetServiceOrderByIdUseCase", () => {
  let useCase: GetServiceOrderByIdUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetServiceOrderByIdUseCase();
  });

  it("deve buscar ordem por id", async () => {
    const mockOrder = { id: 1, status: "RECEBIDA", services: [], parts: [], executions: [] };
    mockRepo.findOne.mockResolvedValue(mockOrder);

    const result = await useCase.execute(1);
    expect(result).toHaveProperty("id", 1);
  });

  it("deve retornar null se ordem não existir", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await useCase.execute(999);
    expect(result).toBeNull();
  });
});