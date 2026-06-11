"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePartUseCase = void 0;
const PartRepository_1 = require("../../../infrastructure/repositories/PartRepository");
const GetPartByIdUseCase_1 = require("./GetPartByIdUseCase");
class DeletePartUseCase {
    constructor() {
        this.getPartByIdUseCase = new GetPartByIdUseCase_1.GetPartByIdUseCase();
    }
    async delete(id) {
        const part = await this.getPartByIdUseCase.getById(id);
        if (!part)
            throw new Error("Peça não encontrada");
        return PartRepository_1.PartRepository.remove(part);
    }
}
exports.DeletePartUseCase = DeletePartUseCase;
