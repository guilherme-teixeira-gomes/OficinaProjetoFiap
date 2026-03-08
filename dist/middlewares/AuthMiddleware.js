"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = AuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_errors_1 = require("../helpers/api-errors");
const UserRepository_1 = require("../repositories/UserRepository");
async function AuthMiddleware(req, res, next) {
    if (req.path.startsWith("/public")) {
        return next();
    }
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new api_errors_1.UnauthorizedError("Token not provided");
        }
        const token = authorization.split(" ")[1];
        const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_PASS ?? "");
        const user = await UserRepository_1.UserRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new api_errors_1.UnauthorizedError("User not found");
        }
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
