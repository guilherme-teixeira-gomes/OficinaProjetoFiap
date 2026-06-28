"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientRepository_1 = require("../../../../infrastructure/repositories/ClientRepository");
const GetClientByIdUseCase_1 = require("../GetClientByIdUseCase");
jest.mock("../../../../infrastructure/repositories/ClientRepository", () => ({
    ClientRepository: {
        findOne: jest.fn(),
    }
}));
describe("GetClientByIdUseCase", () => {
    let getClientByIdUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        getClientByIdUseCase = new GetClientByIdUseCase_1.GetClientByIdUseCase();
    });
    it("deve buscar cliente por id com relacionamentos", async () => {
        const mockClient = { id: 1, name: "João", vehicles: [], orders: [] };
        ClientRepository_1.ClientRepository.findOne.mockResolvedValue(mockClient);
        const result = await getClientByIdUseCase.getById(1);
        expect(result).toHaveProperty("id", 1);
        expect(ClientRepository_1.ClientRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ["vehicles", "orders"]
        });
    });
    it("deve retornar null se cliente não existir", async () => {
        ClientRepository_1.ClientRepository.findOne.mockResolvedValue(null);
        const result = await getClientByIdUseCase.getById(999);
        expect(result).toBeNull();
    });
});
