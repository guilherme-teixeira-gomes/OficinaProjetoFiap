
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

export function validatePlate(plate: string): string {
  const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
 
  const oldFormat      = /^[A-Z]{3}[0-9]{4}$/;
  const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
 
  if (!oldFormat.test(normalized) && !mercosulFormat.test(normalized)) {
    throw new Error(
      "Placa de veículo inválida. Formatos aceitos: ABC1234 (antigo) ou ABC1D23 (Mercosul)"
    );
  }
 
  return normalized;
}
 
export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
 
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
 
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(digits[10]);
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) return false;
 
  const calcDigit = (d: string, weights: number[]) =>
    weights.reduce((sum, w, i) => sum + parseInt(d[i]) * w, 0);
 
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
 
  const r1 = calcDigit(digits, w1) % 11;
  if ((r1 < 2 ? 0 : 11 - r1) !== parseInt(digits[12])) return false;
 
  const r2 = calcDigit(digits, w2) % 11;
  return (r2 < 2 ? 0 : 11 - r2) === parseInt(digits[13]);
}
 
/**
 * Valida e normaliza CPF ou CNPJ.
 */
export function validateDocument(document: string): string {
  const digits = document.replace(/\D/g, "");
 
  if (digits.length === 11) {
    if (!validateCPF(digits)) throw new Error("CPF ou CNPJ inválido");
    return digits;
  }
 
  if (digits.length === 14) {
    if (!validateCNPJ(digits)) throw new Error("CPF ou CNPJ inválido");
    return digits;
  }
 
  throw new Error("CPF ou CNPJ inválido");
}
 