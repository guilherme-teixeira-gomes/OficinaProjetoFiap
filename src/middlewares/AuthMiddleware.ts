import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../helpers/api-errors";
import { UserRepository } from "../repositories/UserRepository";

const JWT_SECRET = "supersecret"; 

type JwtPayload = {
  id: number;
};

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.path === "/user/login" || req.path === "/user" || req.path.startsWith("/public")) {
    return next();
  }

  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError("Token não fornecido");
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("Token inválido");
    }

    const { id } = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await UserRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedError("Usuário não encontrado");
    }

    (req as any).user = { id: user.id, name: user.name, email: user.email, role: user.role };

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.statusCode === 401) {
      res.status(401).json({ message: "Token inválido ou expirado." });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
}