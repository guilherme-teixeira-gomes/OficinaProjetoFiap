import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";

const JWT_SECRET = "supersecret"; // segredo fixo para teste, pode trocar ou usar env

export class UserService {
  // Criar usuário administrativo
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

  // Login administrativo
  static async login(email: string, password: string) {
    const user = await UserRepository.findOne({ where: { email } });
    if (!user) throw new Error("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Credenciais inválidas");

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "12h" });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  // Logout
  static async logout(userId: number) {
    // Nenhuma atualização no banco necessária
    return { message: "Logout realizado com sucesso" };
  }
}