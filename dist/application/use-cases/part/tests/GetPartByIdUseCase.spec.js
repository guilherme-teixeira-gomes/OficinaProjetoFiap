"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PartRepository_1 = require("../../../../infrastructure/repositories/PartRepository");
const GetPartByIdUseCase_1 = require("../GetPartByIdUseCase");
jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
    PartRepository: {
        findOne: jest.fn(),
    }
}));
describe("GetPartByIdUseCase", () => {
    let getPartByIdUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        getPartByIdUseCase = new GetPartByIdUseCase_1.GetPartByIdUseCase();
    });
    it("deve buscar peça por id", async () => {
        const mockPart = { id: 1, name: "Filtro", price: 50 };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(mockPart);
        const result = await getPartByIdUseCase.getById(1);
        expect(result).toHaveProperty("id", 1);
    });
    it("deve retornar null se peça não existir", async () => {
        PartRepository_1.PartRepository.findOne.mockResolvedValue(null);
        const result = await getPartByIdUseCase.getById(999);
        expect(result).toBeNull();
    });
});
