"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePartUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Part_1 = require("../../../domain/entities/Part");
class UpdatePartUseCase {
    async update(id, data) {
        const repo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const part = await repo.findOne({ where: { id } });
        if (!part)
            throw new Error("Peça não encontrada");
        repo.merge(part, data);
        return repo.save(part);
    }
}
exports.UpdatePartUseCase = UpdatePartUseCase;
