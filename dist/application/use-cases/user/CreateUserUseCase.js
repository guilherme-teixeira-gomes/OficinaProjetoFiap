"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserRepository_1 = require("../../../infrastructure/repositories/UserRepository");
class CreateUserUseCase {
    static async createUser(data) {
        const { name, email, password, role } = data;
        const existingUser = await UserRepository_1.UserRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("Usuário já existe");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = UserRepository_1.UserRepository.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        return await UserRepository_1.UserRepository.save(user);
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
