import { ClientRepository } from "../../../../infrastructure/repositories/ClientRepository";
import { ListClientsUseCase } from "../ListClientsUseCase";


jest.mock("../../../../infrastructure/repositories/ClientRepository", () => ({
  ClientRepository: {
    find: jest.fn(),
  }
}));

describe("ListClientsUseCase", () => {
  let listClientsUseCase: ListClientsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listClientsUseCase = new ListClientsUseCase();
  });

  it("deve listar clientes com seus relacionamentos", async () => {
    const mockClients = [
      { id: 1, name: "João", vehicles: [], orders: [] },
      { id: 2, name: "Maria", vehicles: [], orders: [] }
    ];

    (ClientRepository.find as jest.Mock).mockResolvedValue(mockClients);

    const result = await listClientsUseCase.list();

    expect(result).toHaveLength(2);
    expect(ClientRepository.find).toHaveBeenCalledWith({ relations: ["vehicles", "orders"] });
  });

  it("deve retornar array vazio quando não há clientes", async () => {
    (ClientRepository.find as jest.Mock).mockResolvedValue([]);

    const result = await listClientsUseCase.list();

    expect(result).toEqual([]);
  });
});