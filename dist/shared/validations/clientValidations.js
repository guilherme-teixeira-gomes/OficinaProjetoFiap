"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createClientValidation = [
    (0, express_validator_1.body)("name")
        .notEmpty().withMessage("Nome é obrigatório")
        .isLength({ min: 3 }).withMessage("Nome deve ter ao menos 3 caracteres"),
    (0, express_validator_1.body)("email")
        .notEmpty().withMessage("Email é obrigatório")
        .isEmail().withMessage("Email inválido"),
    (0, express_validator_1.body)("document")
        .notEmpty().withMessage("CPF/CNPJ é obrigatório")
        .custom((value) => {
        const cleanValue = value.replace(/\D/g, "");
        if (cleanValue.length === 11) {
            if (!validateCPF(cleanValue))
                throw new Error("CPF inválido");
        }
        else if (cleanValue.length === 14) {
            if (!validateCNPJ(cleanValue))
                throw new Error("CNPJ inválido");
        }
        else {
            throw new Error("Documento deve ser CPF (11 dígitos) ou CNPJ (14 dígitos)");
        }
        return true;
    }),
];
function validateCPF(cpf) {
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf))
        return false;
    let sum = 0;
    for (let i = 0; i < 9; i++)
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11)
        rev = 0;
    if (rev !== parseInt(cpf.charAt(9)))
        return false;
    sum = 0;
    for (let i = 0; i < 10; i++)
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11)
        rev = 0;
    return rev === parseInt(cpf.charAt(10));
}
function validateCNPJ(cnpj) {
    if (!cnpj || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj))
        return false;
    const calc = (x) => {
        let length = x === 1 ? 12 : 13;
        let numbers = cnpj.substring(0, length).split("").map(Number);
        let pos = length - 7;
        let sum = numbers.reduce((acc, num, i) => {
            acc += num * pos;
            pos = pos - 1 < 2 ? 9 : pos - 1;
            return acc;
        }, 0);
        let result = sum % 11;
        return result < 2 ? 0 : 11 - result;
    };
    return calc(1) === parseInt(cnpj.charAt(12)) && calc(2) === parseInt(cnpj.charAt(13));
}
