import { ClientRepository } from "../../../../infrastructure/repositories/ClientRepository";
import { GetClientByIdUseCase } from "../GetClientByIdUseCase";


jest.mock("../../../infrastructure/repositories/ClientRepository", () => ({
  ClientRepository: {
    findOne: jest.fn(),
  }
}));

describe("GetClientByIdUseCase", () => {
  let getClientByIdUseCase: GetClientByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getClientByIdUseCase = new GetClientByIdUseCase();
  });

  it("deve buscar cliente por id com relacionamentos", async () => {
    const mockClient = { id: 1, name: "João", vehicles: [], orders: [] };

    (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);

    const result = await getClientByIdUseCase.getById(1);

    expect(result).toHaveProperty("id", 1);
    expect(ClientRepository.findOne).toHaveBeenCalledWith({ 
      where: { id: 1 }, 
      relations: ["vehicles", "orders"] 
    });
  });

  it("deve retornar null se cliente não existir", async () => {
    (ClientRepository.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getClientByIdUseCase.getById(999);

    expect(result).toBeNull();
  });
});