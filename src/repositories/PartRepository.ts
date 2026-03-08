import { AppDataSource } from "../data-source";
import { Part } from "../entities/Part";



const PartRepository = AppDataSource.getRepository(Part);