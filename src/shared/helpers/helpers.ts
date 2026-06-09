
import { cpf, cnpj } from "cpf-cnpj-validator";
import { ServiceOrder } from "../../domain/entities/ServiceOrder";

export function calculateDiagnosticTotal(diagnostic: any): number {
  const servicesTotal = diagnostic.recommendedServices
    ?.reduce((sum: number, s: any) => sum + Number(s.price), 0) || 0;
  const partsTotal = diagnostic.recommendedParts
    ?.reduce((sum: number, p: any) => sum + Number(p.price), 0) || 0;
  return servicesTotal + partsTotal;
}

export async function calculateBudgetFromDiagnostics(order: ServiceOrder) {
  const approvedDiagnostics = order.diagnostics?.filter(d => d.includeInBudget) || [];
  let total = 0;
  
  for (const diagnostic of approvedDiagnostics) {
    total += calculateDiagnosticTotal(diagnostic);
  }
  
  return total;
}

export function validateDocument(document: string) {
  const cleaned = document.replace(/\D/g, "");
  if (!cpf.isValid(cleaned) && !cnpj.isValid(cleaned)) {
    throw new Error("CPF ou CNPJ inválido");
  }
  return cleaned;
}

export function validatePlate(plate: string) {
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
  if (!plateRegex.test(normalized)) {
    throw new Error("Placa de veículo inválida");
  }
  return normalized;
}