import { body } from "express-validator";

export const createVehicleValidation = [
    body("plate")
      .notEmpty().withMessage("Placa é obrigatória")
      .matches(/^[A-Z]{3}-\d{4}$/).withMessage("Placa deve estar no formato ABC-1234"),
  
    body("brand").notEmpty().withMessage("Marca é obrigatória"),
    body("model").notEmpty().withMessage("Modelo é obrigatório"),
    body("year")
      .notEmpty().withMessage("Ano é obrigatório")
      .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("Ano inválido"),
  ];