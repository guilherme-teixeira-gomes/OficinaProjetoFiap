"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementRepository = exports.getStockMovementRepository = void 0;
const StockMovement_1 = require("../../domain/entities/StockMovement");
const data_source_1 = require("../database/data-source");
const getStockMovementRepository = () => data_source_1.AppDataSource.getRepository(StockMovement_1.StockMovement);
exports.getStockMovementRepository = getStockMovementRepository;
exports.StockMovementRepository = new Proxy({}, {
    get(_target, prop) {
        return (0, exports.getStockMovementRepository)()[prop];
    }
});
