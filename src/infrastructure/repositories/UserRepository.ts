import { User } from "../../domain/entities/User";
import { AppDataSource } from "../database/data-source";

export const getUserRepository = () => AppDataSource.getRepository(User);
export const UserRepository = new Proxy({} as ReturnType<typeof getUserRepository>, {
  get(_target, prop) {
    return getUserRepository()[prop as keyof ReturnType<typeof getUserRepository>];
  }
});
