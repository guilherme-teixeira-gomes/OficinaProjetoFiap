import { ServiceRepository } from "../../../../infrastructure/repositories/ServiceRepository";
import { ListServicesUseCase } from "../ListServicesUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceRepository", () => ({
  ServiceRepository: {
    find: jest.fn(),
  }
}));

describe("ListServicesUseCase", () => {
  let listServicesUseCase: ListServicesUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listServicesUseCase = new ListServicesUseCase();
  });

  it("deve listar todos os serviços", async () => {
    const mockServices = [
      { id: 1, name: "Troca de óleo", price: 100 },
      { id: 2, name: "Alinhamento", price: 80 }
    ];

    (ServiceRepository.find as jest.Mock).mockResolvedValue(mockServices);

    const result = await listServicesUseCase.list();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Troca de óleo");
    expect(result[1].name).toBe("Alinhamento");
  });

  it("deve retornar array vazio quando não há serviços", async () => {
    (ServiceRepository.find as jest.Mock).mockResolvedValue([]);

    const result = await listServicesUseCase.list();

    expect(result).toEqual([]);
  });
});