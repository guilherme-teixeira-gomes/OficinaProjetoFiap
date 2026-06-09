"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientRepository_1 = require("../../../../infrastructure/repositories/ClientRepository");
const ListClientsUseCase_1 = require("../ListClientsUseCase");
jest.mock("../../../infrastructure/repositories/ClientRepository", () => ({
    ClientRepository: {
        find: jest.fn(),
    }
}));
describe("ListClientsUseCase", () => {
    let listClientsUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        listClientsUseCase = new ListClientsUseCase_1.ListClientsUseCase();
    });
    it("deve listar clientes com seus relacionamentos", async () => {
        const mockClients = [
            { id: 1, name: "João", vehicles: [], orders: [] },
            { id: 2, name: "Maria", vehicles: [], orders: [] }
        ];
        ClientRepository_1.ClientRepository.find.mockResolvedValue(mockClients);
        const result = await listClientsUseCase.list();
        expect(result).toHaveLength(2);
        expect(ClientRepository_1.ClientRepository.find).toHaveBeenCalledWith({ relations: ["vehicles", "orders"] });
    });
    it("deve retornar array vazio quando não há clientes", async () => {
        ClientRepository_1.ClientRepository.find.mockResolvedValue([]);
        const result = await listClientsUseCase.list();
        expect(result).toEqual([]);
    });
});
