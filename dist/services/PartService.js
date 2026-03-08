"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartService = void 0;
// services/PartService.ts
const PartRepository_1 = require("../repositories/PartRepository");
class PartService {
    async create(data) {
        const part = PartRepository_1.PartRepository.create(data);
        return PartRepository_1.PartRepository.save(part);
    }
    async list() {
        return PartRepository_1.PartRepository.find();
    }
    async getById(id) {
        return PartRepository_1.PartRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        const part = await this.getById(id);
        if (!part)
            throw new Error("Peça não encontrada");
        PartRepository_1.PartRepository.merge(part, data);
        return PartRepository_1.PartRepository.save(part);
    }
    async delete(id) {
        const part = await this.getById(id);
        if (!part)
            throw new Error("Peça não encontrada");
        return PartRepository_1.PartRepository.remove(part);
    }
}
exports.PartService = PartService;
