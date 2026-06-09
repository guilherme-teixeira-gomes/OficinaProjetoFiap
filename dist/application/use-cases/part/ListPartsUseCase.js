"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPartsUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
class ListPartsUseCase {
    async list() {
        return PartRepository_1.PartRepository.find();
    }
}
exports.ListPartsUseCase = ListPartsUseCase;
