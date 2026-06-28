"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePartUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Part_1 = require("../../../domain/entities/Part");
class DeletePartUseCase {
    async delete(id) {
        const repo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const part = await repo.findOne({ where: { id } });
        if (!part)
            throw new Error("Peça não encontrada");
        return repo.remove(part);
    }
}
exports.DeletePartUseCase = DeletePartUseCase;
