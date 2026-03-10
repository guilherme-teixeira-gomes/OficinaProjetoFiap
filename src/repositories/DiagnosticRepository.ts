import { AppDataSource } from "../data-source";
import { Diagnostic } from "../entities/Diagnostic";


export const DiagnosticRepository = AppDataSource.getRepository(Diagnostic);