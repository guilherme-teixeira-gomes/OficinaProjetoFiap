"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePartUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
class CreatePartUseCase {
    async create(data) {
        const part = PartRepository_1.PartRepository.create(data);
        return PartRepository_1.PartRepository.save(part);
    }
}
exports.CreatePartUseCase = CreatePartUseCase;
