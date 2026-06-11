"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const CreateUserUseCase_1 = require("../CreateUserUseCase");
const UserRepository_1 = require("../../../../infrastructure/repositories/UserRepository");
jest.mock("../../../../infrastructure/repositories/UserRepository", () => ({
    UserRepository: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    }
}));
jest.mock("bcrypt");
describe("CreateUserUseCase", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve criar usuário com sucesso", async () => {
        UserRepository_1.UserRepository.findOne.mockResolvedValue(null);
        bcrypt_1.default.hash.mockResolvedValue("hashed");
        UserRepository_1.UserRepository.create.mockReturnValue({ id: 1, name: "Gui", email: "gui@email.com", role: "admin" });
        UserRepository_1.UserRepository.save.mockResolvedValue({ id: 1, name: "Gui", email: "gui@email.com", role: "admin" });
        // Chamada ESTÁTICA - não usa new
        const result = await CreateUserUseCase_1.CreateUserUseCase.createUser({
            name: "Gui",
            email: "gui@email.com",
            password: "123",
            role: "admin"
        });
        expect(result).toHaveProperty("id");
        expect(bcrypt_1.default.hash).toHaveBeenCalledWith("123", 10);
    });
    it("deve dar erro se usuário já existir", async () => {
        UserRepository_1.UserRepository.findOne.mockResolvedValue({ id: 1, email: "gui@email.com" });
        await expect(CreateUserUseCase_1.CreateUserUseCase.createUser({
            name: "Gui",
            email: "gui@email.com",
            password: "123",
            role: "admin"
        })).rejects.toThrow("Usuário já existe");
    });
});
