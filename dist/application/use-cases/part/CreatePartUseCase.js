"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePartUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Part_1 = require("../../../domain/entities/Part");
class CreatePartUseCase {
    async create(data) {
        const repo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        const part = repo.create(data);
        return repo.save(part);
    }
}
exports.CreatePartUseCase = CreatePartUseCase;
