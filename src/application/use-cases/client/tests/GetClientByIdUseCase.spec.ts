import { GetClientByIdUseCase } from "../GetClientByIdUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetClientByIdUseCase", () => {
  let useCase: GetClientByIdUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetClientByIdUseCase();
  });

  it("deve buscar cliente por id com relacionamentos", async () => {
    const mockClient = { id: 1, name: "Gui", vehicles: [], orders: [] };
    mockRepo.findOne.mockResolvedValue(mockClient);

    const result = await useCase.getById(1);
    expect(result).toHaveProperty("id", 1);
  });

  it("deve retornar null se cliente não existir", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await useCase.getById(999);
    expect(result).toBeNull();
  });
});