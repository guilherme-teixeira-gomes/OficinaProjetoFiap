import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../helpers/api-errors";
import { UserRepository } from "../repositories/UserRepository";




type JwtPayload = {
  id: number;
};

export async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.path.startsWith("/public")) {
    return next();
  }

  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError("Token not provided");
    }

    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as JwtPayload;

    const user = await UserRepository.findOne({
      where: { id },
     
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }
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
