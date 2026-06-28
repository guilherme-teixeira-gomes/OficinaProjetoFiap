import { GetServiceByIdUseCase } from "../GetServiceByIdUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetServiceByIdUseCase", () => {
  let useCase: GetServiceByIdUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetServiceByIdUseCase();
  });

  it("deve buscar serviço por id", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, name: "Troca de óleo" });
    const result = await useCase.getById(1);
    expect(result).toHaveProperty("id", 1);
  });

  it("deve retornar null se serviço não existir", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await useCase.getById(999);
    expect(result).toBeNull();
  });
});