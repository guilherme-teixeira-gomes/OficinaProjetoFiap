"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PartRepository_1 = require("../../../../infrastructure/repositories/PartRepository");
const ListPartsUseCase_1 = require("../ListPartsUseCase");
jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
    PartRepository: {
        find: jest.fn(),
    }
}));
describe("ListPartsUseCase", () => {
    let listPartsUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        listPartsUseCase = new ListPartsUseCase_1.ListPartsUseCase();
    });
    it("deve listar todas as peças", async () => {
        const mockParts = [
            { id: 1, name: "Filtro", price: 50 },
            { id: 2, name: "Pastilha", price: 80 }
        ];
        PartRepository_1.PartRepository.find.mockResolvedValue(mockParts);
        const result = await listPartsUseCase.list();
        expect(result).toHaveLength(2);
    });
    it("deve retornar array vazio quando não há peças", async () => {
        PartRepository_1.PartRepository.find.mockResolvedValue([]);
        const result = await listPartsUseCase.list();
        expect(result).toEqual([]);
    });
});
