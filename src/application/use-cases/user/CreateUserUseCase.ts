import bcrypt from "bcrypt";
import { AppDataSource } from "../../../infrastructure/database/data-source";
import { User } from "../../../domain/entities/User";

export class CreateUserUseCase {
  static async createUser(data: { name: string; email: string; password: string; role: string }) {
    const repo = AppDataSource.getRepository(User);
    const { name, email, password, role } = data;

    const existingUser = await repo.findOne({ where: { email } });
    if (existingUser) throw new Error("Usuário já existe");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = repo.create({ name, email, password: hashedPassword, role });
    return await repo.save(user);
  }
}