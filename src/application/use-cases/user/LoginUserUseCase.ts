import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { User } from "../../../domain/entities/User";

const JWT_SECRET = process.env.JWT_PASS!;

export class LoginUserUseCase {
  static async login(email: string, password: string) {
    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOne({ where: { email } });
    if (!user) throw new Error("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Credenciais inválidas");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}