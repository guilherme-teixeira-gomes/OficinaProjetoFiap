import { User } from "../../domain/entities/User";
import { AppDataSource } from "../database/data-source";

export const UserRepository = AppDataSource.getRepository(User);