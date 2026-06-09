"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementRepository = void 0;
const StockMovement_1 = require("../../domain/entities/StockMovement");
const data_source_1 = require("../database/data-source");
exports.StockMovementRepository = data_source_1.AppDataSource.getRepository(StockMovement_1.StockMovement);
