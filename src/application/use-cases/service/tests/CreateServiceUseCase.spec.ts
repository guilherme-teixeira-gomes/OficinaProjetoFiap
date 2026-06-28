import { CreateServiceUseCase } from "../CreateServiceUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("CreateServiceUseCase", () => {
  let useCase: CreateServiceUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { create: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new CreateServiceUseCase();
  });

  it("deve criar serviço com sucesso", async () => {
    const mockService = { id: 1, name: "Troca de óleo", price: 150 };
    mockRepo.create.mockReturnValue(mockService);
    mockRepo.save.mockResolvedValue(mockService);

    const result = await useCase.create({ name: "Troca de óleo", price: 150 });
    expect(result).toHaveProperty("id", 1);
  });

  it("deve criar serviço com descrição opcional", async () => {
    const mockService = { id: 2, name: "Alinhamento", price: 80, description: "Desc" };
    mockRepo.create.mockReturnValue(mockService);
    mockRepo.save.mockResolvedValue(mockService);

    const result = await useCase.create({ name: "Alinhamento", price: 80, description: "Desc" });
    expect(result).toHaveProperty("description", "Desc");
  });

  it("deve criar serviço com active false", async () => {
    const mockService = { id: 3, name: "Serviço", price: 100, active: false };
    mockRepo.create.mockReturnValue(mockService);
    mockRepo.save.mockResolvedValue(mockService);

    const result = await useCase.create({ name: "Serviço", price: 100, active: false });
    expect(result).toHaveProperty("active", false);
  });

  it("deve criar serviço com active true por padrão", async () => {
    const mockService = { id: 4, name: "Serviço", price: 100, active: true };
    mockRepo.create.mockReturnValue(mockService);
    mockRepo.save.mockResolvedValue(mockService);

    const result = await useCase.create({ name: "Serviço", price: 100 });
    expect(result).toHaveProperty("active", true);
  });
});