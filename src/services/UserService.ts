import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";

const JWT_SECRET = "supersecret";

export class UserService {
  static async createUser(data: { name: string; email: string; password: string; role: string }) {
    const { name, email, password, role } = data;

    const existingUser = await UserRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Usuário já existe");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = UserRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return await UserRepository.save(user);
  }

  static async login(email: string, password: string) {
    const user = await UserRepository.findOne({ where: { email } });
    if (!user) throw new Error("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Credenciais inválidas");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async logout(userId: number) {
    return { message: "Logout realizado com sucesso" };
  }
}