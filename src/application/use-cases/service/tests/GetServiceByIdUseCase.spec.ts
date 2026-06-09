import { ServiceRepository } from "../../../../infrastructure/repositories/ServiceRepository";
import { GetServiceByIdUseCase } from "../GetServiceByIdUseCase";


jest.mock("../../../infrastructure/repositories/ServiceRepository", () => ({
  ServiceRepository: {
    findOne: jest.fn(),
  }
}));

describe("GetServiceByIdUseCase", () => {
  let getServiceByIdUseCase: GetServiceByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getServiceByIdUseCase = new GetServiceByIdUseCase();
  });

  it("deve buscar serviço por id", async () => {
    const mockService = { id: 1, name: "Troca de óleo", price: 100 };

    (ServiceRepository.findOne as jest.Mock).mockResolvedValue(mockService);

    const result = await getServiceByIdUseCase.getById(1);

    expect(result).toHaveProperty("id", 1);
    expect(ServiceRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("deve retornar null se serviço não existir", async () => {
    (ServiceRepository.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getServiceByIdUseCase.getById(999);

    expect(result).toBeNull();
  });
});