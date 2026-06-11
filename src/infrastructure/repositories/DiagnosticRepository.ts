import { Diagnostic } from "../../domain/entities/Diagnostic";
import { AppDataSource } from "../database/data-source";

export const getDiagnosticRepository = () => AppDataSource.getRepository(Diagnostic);
export const DiagnosticRepository = new Proxy({} as ReturnType<typeof getDiagnosticRepository>, {
  get(_target, prop) {
    return getDiagnosticRepository()[prop as keyof ReturnType<typeof getDiagnosticRepository>];
  }
});
