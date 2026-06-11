"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const LoginUserUseCase_1 = require("../LoginUserUseCase");
const UserRepository_1 = require("../../../../infrastructure/repositories/UserRepository");
jest.mock("../../../../infrastructure/repositories/UserRepository", () => ({
    UserRepository: {
        findOne: jest.fn(),
    }
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
describe("LoginUserUseCase", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("deve fazer login com sucesso", async () => {
        const mockUser = {
            id: 1,
            name: "Gui",
            email: "gui@email.com",
            password: "hashed",
            role: "admin"
        };
        UserRepository_1.UserRepository.findOne.mockResolvedValue(mockUser);
        bcrypt_1.default.compare.mockResolvedValue(true);
        jsonwebtoken_1.default.sign.mockReturnValue("token123");
        // Chamada ESTÁTICA - não usa new
        const result = await LoginUserUseCase_1.LoginUserUseCase.login("gui@email.com", "123");
        expect(result).toHaveProperty("token");
        expect(result.user).toHaveProperty("id", 1);
        expect(result.user).not.toHaveProperty("password");
    });
    it("deve falhar login se usuário não existir", async () => {
        UserRepository_1.UserRepository.findOne.mockResolvedValue(null);
        await expect(LoginUserUseCase_1.LoginUserUseCase.login("naoexiste@email.com", "123")).rejects.toThrow("Credenciais inválidas");
    });
    it("deve falhar login com senha inválida", async () => {
        const mockUser = {
            id: 1,
            email: "gui@email.com",
            password: "hashed"
        };
        UserRepository_1.UserRepository.findOne.mockResolvedValue(mockUser);
        bcrypt_1.default.compare.mockResolvedValue(false);
        await expect(LoginUserUseCase_1.LoginUserUseCase.login("gui@email.com", "senhaerrada")).rejects.toThrow("Credenciais inválidas");
    });
});
