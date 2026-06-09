"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../../../infrastructure/repositories/UserRepository");
const JWT_SECRET = "supersecret";
class LoginUserUseCase {
    static async login(email, password) {
        const user = await UserRepository_1.UserRepository.findOne({ where: { email } });
        if (!user)
            throw new Error("Credenciais inválidas");
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid)
            throw new Error("Credenciais inválidas");
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
