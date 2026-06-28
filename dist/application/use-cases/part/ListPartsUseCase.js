"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPartsUseCase = void 0;
const data_source_1 = require("../../../infrastructure/database/data-source");
const Part_1 = require("../../../domain/entities/Part");
class ListPartsUseCase {
    async list() {
        const repo = data_source_1.AppDataSource.getRepository(Part_1.Part);
        return repo.find();
    }
}
exports.ListPartsUseCase = ListPartsUseCase;
