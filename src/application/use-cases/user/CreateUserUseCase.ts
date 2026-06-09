import bcrypt from "bcrypt";

import { UserRepository } from "../../../infrastructure/repositories/UserRepository";

export class CreateUserUseCase {
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
}