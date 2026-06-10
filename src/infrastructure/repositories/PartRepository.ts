import { Part } from "../../domain/entities/Part";
import { AppDataSource } from "../database/data-source";

export const getPartRepository = () => AppDataSource.getRepository(Part);
export const PartRepository = new Proxy({} as ReturnType<typeof getPartRepository>, {
  get(_target, prop) {
    return getPartRepository()[prop as keyof ReturnType<typeof getPartRepository>];
  }
});
