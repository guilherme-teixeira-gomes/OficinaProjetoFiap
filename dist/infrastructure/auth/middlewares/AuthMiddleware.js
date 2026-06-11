"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = AuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_errors_1 = require("../../../shared/helpers/api-errors");
const UserRepository_1 = require("../../repositories/UserRepository");
const JWT_SECRET = "supersecret";
async function AuthMiddleware(req, res, next) {
    if (req.path === "/user/login" || req.path === "/user" || req.path.startsWith("/public")) {
        return next();
    }
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new api_errors_1.UnauthorizedError("Token não fornecido");
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            throw new api_errors_1.UnauthorizedError("Token inválido");
        }
        const { id } = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await UserRepository_1.UserRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new api_errors_1.UnauthorizedError("Usuário não encontrado");
        }
        req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError" || error.statusCode === 401) {
            res.status(401).json({ message: "Token inválido ou expirado." });
        }
        else {
            res
                .status(500)
                .json({ message: "Internal Server Error", error: error.message });
        }
    }
}
