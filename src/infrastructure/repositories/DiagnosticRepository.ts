import { Diagnostic } from "../../domain/entities/Diagnostic";
import { AppDataSource } from "../database/data-source";

export const DiagnosticRepository = AppDataSource.getRepository(Diagnostic);