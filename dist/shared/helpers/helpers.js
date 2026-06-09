"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDiagnosticTotal = calculateDiagnosticTotal;
exports.calculateBudgetFromDiagnostics = calculateBudgetFromDiagnostics;
exports.validateDocument = validateDocument;
exports.validatePlate = validatePlate;
const cpf_cnpj_validator_1 = require("cpf-cnpj-validator");
function calculateDiagnosticTotal(diagnostic) {
    const servicesTotal = diagnostic.recommendedServices
        ?.reduce((sum, s) => sum + Number(s.price), 0) || 0;
    const partsTotal = diagnostic.recommendedParts
        ?.reduce((sum, p) => sum + Number(p.price), 0) || 0;
    return servicesTotal + partsTotal;
}
async function calculateBudgetFromDiagnostics(order) {
    const approvedDiagnostics = order.diagnostics?.filter(d => d.includeInBudget) || [];
    let total = 0;
    for (const diagnostic of approvedDiagnostics) {
        total += calculateDiagnosticTotal(diagnostic);
    }
    return total;
}
function validateDocument(document) {
    const cleaned = document.replace(/\D/g, "");
    if (!cpf_cnpj_validator_1.cpf.isValid(cleaned) && !cpf_cnpj_validator_1.cnpj.isValid(cleaned)) {
        throw new Error("CPF ou CNPJ inválido");
    }
    return cleaned;
}
function validatePlate(plate) {
    const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
    if (!plateRegex.test(normalized)) {
        throw new Error("Placa de veículo inválida");
    }
    return normalized;
}
