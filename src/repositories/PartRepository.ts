import { AppDataSource } from "../data-source";
import { Part } from "../entities/Part";

export const PartRepository = AppDataSource.getRepository(Part);