import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../../shared/helpers/api-errors";
import { UserRepository } from "../../repositories/UserRepository";

const JWT_SECRET = process.env.JWT_PASS!;

// Token de usuário interno (mecânico/admin) — emitido pelo login da aplicação
type UserJwtPayload = {
  id: number;
};

// Token de cliente — emitido pela Lambda de autenticação por CPF
type ClientJwtPayload = {
  sub: string;
  cpf: string;
  name: string;
  type: "client";
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

    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload | ClientJwtPayload;

    // Token de cliente (emitido pela Lambda de autenticação por CPF)
    if ((decoded as ClientJwtPayload).type === "client") {
      const clientToken = decoded as ClientJwtPayload;
      (req as any).client = {
        id: Number(clientToken.sub),
        cpf: clientToken.cpf,
        name: clientToken.name
      };
      (req as any).authType = "client";
      return next();
    }

    // Token de usuário interno (mecânico/admin) — comportamento original
    const { id } = decoded as UserJwtPayload;

    const user = await UserRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedError("Usuário não encontrado");
    }

    (req as any).user = { id: user.id, name: user.name, email: user.email, role: user.role };
    (req as any).authType = "user";

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError" || error.statusCode === 401) {
      res.status(401).json({ message: "Token inválido ou expirado." });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  }
}