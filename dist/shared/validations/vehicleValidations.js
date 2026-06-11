"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVehicleValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createVehicleValidation = [
    (0, express_validator_1.body)("plate")
        .notEmpty().withMessage("Placa é obrigatória")
        .matches(/^[A-Z]{3}-\d{4}$/).withMessage("Placa deve estar no formato ABC-1234"),
    (0, express_validator_1.body)("brand").notEmpty().withMessage("Marca é obrigatória"),
    (0, express_validator_1.body)("model").notEmpty().withMessage("Modelo é obrigatório"),
    (0, express_validator_1.body)("year")
        .notEmpty().withMessage("Ano é obrigatório")
        .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("Ano inválido"),
];
