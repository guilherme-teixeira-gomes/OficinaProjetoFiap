"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_source_1 = require("../../../infrastructure/database/data-source");
const User_1 = require("../../../domain/entities/User");
class CreateUserUseCase {
    static async createUser(data) {
        const repo = data_source_1.AppDataSource.getRepository(User_1.User);
        const { name, email, password, role } = data;
        const existingUser = await repo.findOne({ where: { email } });
        if (existingUser)
            throw new Error("Usuário já existe");
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = repo.create({ name, email, password: hashedPassword, role });
        return await repo.save(user);
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
