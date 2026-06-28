"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientRepository_1 = require("../../../../infrastructure/repositories/ClientRepository");
const CreateClientUseCase_1 = require("../CreateClientUseCase");
jest.mock("../../../../infrastructure/repositories/ClientRepository", () => ({
    ClientRepository: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    }
}));
describe("CreateClientUseCase", () => {
    let createClientUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        createClientUseCase = new CreateClientUseCase_1.CreateClientUseCase();
    });
    it("deve criar cliente com sucesso", async () => {
        ClientRepository_1.ClientRepository.findOne.mockResolvedValue(null);
        const mockClient = { id: 1, name: "Gui", document: "123", email: "teste@email.com", phone: "999" };
        ClientRepository_1.ClientRepository.create.mockReturnValue(mockClient);
        ClientRepository_1.ClientRepository.save.mockResolvedValue(mockClient);
        const result = await createClientUseCase.execute({
            name: "Gui",
            document: "123",
            email: "teste@email.com",
            phone: "999"
        });
        expect(ClientRepository_1.ClientRepository.create).toHaveBeenCalled();
        expect(ClientRepository_1.ClientRepository.save).toHaveBeenCalled();
        expect(result).toHaveProperty("id", 1);
    });
    it("deve lançar erro se cliente já existir", async () => {
        ClientRepository_1.ClientRepository.findOne.mockResolvedValue({ id: 1, document: "123" });
        await expect(createClientUseCase.execute({
            name: "Gui",
            document: "123",
            email: "teste@email.com",
            phone: "999"
        })).rejects.toThrow("Cliente já cadastrado");
    });
});
