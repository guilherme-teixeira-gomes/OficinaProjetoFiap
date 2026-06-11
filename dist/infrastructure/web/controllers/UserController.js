"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const CreateUserUseCase_1 = require("../../../application/use-cases/user/CreateUserUseCase");
const LoginUserUseCase_1 = require("../../../application/use-cases/user/LoginUserUseCase");
const LogoutUserUseCase_1 = require("../../../application/use-cases/user/LogoutUserUseCase");
class UserController {
    async handle(req, res) {
        try {
            const user = await CreateUserUseCase_1.CreateUserUseCase.createUser(req.body);
            const { password: _, ...userWithoutPassword } = user;
            res.status(201).json(userWithoutPassword);
        }
        catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await LoginUserUseCase_1.LoginUserUseCase.login(email, password);
            res.json(result);
        }
        catch (err) {
            res.status(401).json({ message: err.message });
        }
    }
    async logout(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId)
                return res.status(400).json({ message: "Usuário não autenticado" });
            const result = await LogoutUserUseCase_1.LogoutUserUseCase.logout(userId);
            res.json(result);
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}
exports.UserController = UserController;
