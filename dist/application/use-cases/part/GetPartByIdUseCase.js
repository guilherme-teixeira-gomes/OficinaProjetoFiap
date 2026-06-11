"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPartByIdUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
class GetPartByIdUseCase {
    async getById(id) {
        return PartRepository_1.PartRepository.findOne({ where: { id } });
    }
}
exports.GetPartByIdUseCase = GetPartByIdUseCase;
