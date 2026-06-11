"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePartUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
const GetPartByIdUseCase_1 = require("./GetPartByIdUseCase");
class UpdatePartUseCase {
    constructor() {
        this.getPartByIdUseCase = new GetPartByIdUseCase_1.GetPartByIdUseCase();
    }
    async update(id, data) {
        const part = await this.getPartByIdUseCase.getById(id);
        if (!part)
            throw new Error("Peça não encontrada");
        PartRepository_1.PartRepository.merge(part, data);
        return PartRepository_1.PartRepository.save(part);
    }
}
exports.UpdatePartUseCase = UpdatePartUseCase;
