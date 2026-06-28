"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientRepository_1 = require("../../../../infrastructure/repositories/ClientRepository");
const GetClientByDocumentUseCase_1 = require("../GetClientByDocumentUseCase");
jest.mock("../../../../infrastructure/repositories/ClientRepository", () => ({
    ClientRepository: {
        findOne: jest.fn(),
    }
}));
describe("GetClientByDocumentUseCase", () => {
    let getClientByDocumentUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        getClientByDocumentUseCase = new GetClientByDocumentUseCase_1.GetClientByDocumentUseCase();
    });
    it("deve buscar cliente por documento", async () => {
        const mockClient = { id: 1, name: "João", document: "12345678901" };
        ClientRepository_1.ClientRepository.findOne.mockResolvedValue(mockClient);
        const result = await getClientByDocumentUseCase.getByDocument("12345678901");
        expect(result).toHaveProperty("id", 1);
        expect(ClientRepository_1.ClientRepository.findOne).toHaveBeenCalledWith({
            where: { document: "12345678901" },
            relations: ["vehicles", "orders"]
        });
    });
    it("deve retornar null se cliente não existir", async () => {
        ClientRepository_1.ClientRepository.findOne.mockResolvedValue(null);
        const result = await getClientByDocumentUseCase.getByDocument("999");
        expect(result).toBeNull();
    });
});
