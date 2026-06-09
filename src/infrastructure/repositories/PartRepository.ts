import { Part } from "../../domain/entities/Part";
import { AppDataSource } from "../database/data-source";

export const PartRepository = AppDataSource.getRepository(Part);