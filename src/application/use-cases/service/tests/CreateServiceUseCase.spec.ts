import { ServiceRepository } from "../../../../infrastructure/repositories/ServiceRepository";
import { CreateServiceUseCase } from "../CreateServiceUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceRepository", () => ({
  ServiceRepository: {
    create: jest.fn(),
    save: jest.fn(),
  }
}));

describe("CreateServiceUseCase", () => {
  let createServiceUseCase: CreateServiceUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createServiceUseCase = new CreateServiceUseCase();
  });

  it("deve criar serviço com sucesso", async () => {
    const mockService = { id: 1, name: "Troca de óleo", price: 100 };

    (ServiceRepository.create as jest.Mock).mockReturnValue(mockService);
    (ServiceRepository.save as jest.Mock).mockResolvedValue(mockService);

    const result = await createServiceUseCase.create({
      name: "Troca de óleo",
      price: 100
    });

    expect(result).toHaveProperty("id", 1);
    expect(result.name).toBe("Troca de óleo");
  });

  it("deve criar serviço com descrição opcional", async () => {
    const mockService = {
      id: 1,
      name: "Troca de óleo",
      description: "Troca de óleo do motor",
      price: 100
    };

    (ServiceRepository.create as jest.Mock).mockReturnValue(mockService);
    (ServiceRepository.save as jest.Mock).mockResolvedValue(mockService);

    const result = await createServiceUseCase.create({
      name: "Troca de óleo",
      description: "Troca de óleo do motor",
      price: 100
    });

    expect(result.description).toBe("Troca de óleo do motor");
  });

  it("deve criar serviço com active false", async () => {
    const mockService = { id: 1, name: "Troca de óleo", price: 100, active: false };

    (ServiceRepository.create as jest.Mock).mockReturnValue(mockService);
    (ServiceRepository.save as jest.Mock).mockResolvedValue(mockService);

    const result = await createServiceUseCase.create({
      name: "Troca de óleo",
      price: 100,
      active: false
    });

    expect(result.active).toBe(false);
  });

  it("deve criar serviço com active true por padrão", async () => {
    const mockService = { id: 1, name: "Troca de óleo", price: 100, active: true };

    (ServiceRepository.create as jest.Mock).mockReturnValue(mockService);
    (ServiceRepository.save as jest.Mock).mockResolvedValue(mockService);

    const result = await createServiceUseCase.create({
      name: "Troca de óleo",
      price: 100
    });

    expect(result.active).toBe(true);
  });
});