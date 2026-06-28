"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../../../infrastructure/database/data-source");
const User_1 = require("../../../domain/entities/User");
const JWT_SECRET = process.env.JWT_PASS;
class LoginUserUseCase {
    static async login(email, password) {
        const repo = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await repo.findOne({ where: { email } });
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
