"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PartRepository_1 = require("../../../../infrastructure/repositories/PartRepository");
const StockMovementRepository_1 = require("../../../../infrastructure/repositories/StockMovementRepository");
const AddStockUseCase_1 = require("../AddStockUseCase");
jest.mock("../../../infrastructure/repositories/PartRepository", () => ({
    PartRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
    }
}));
jest.mock("../../../infrastructure/repositories/StockMovementRepository", () => ({
    StockMovementRepository: {
        create: jest.fn(),
        save: jest.fn(),
    }
}));
describe("AddStockUseCase", () => {
    let addStockUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        addStockUseCase = new AddStockUseCase_1.AddStockUseCase();
    });
    it("deve adicionar estoque com sucesso", async () => {
        const mockPart = {
            id: 1,
            name: "Filtro de óleo",
            price: 50,
            stock: 10
        };
        const mockMovement = {
            id: 1,
            partId: 1,
            partName: "Filtro de óleo",
            quantity: 5,
            type: "IN",
            unitPrice: 50,
            totalValue: 250,
            description: "Entrada de estoque",
            status: "CONFIRMADO"
        };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(mockPart);
        PartRepository_1.PartRepository.save.mockResolvedValue({ ...mockPart, stock: 15 });
        StockMovementRepository_1.StockMovementRepository.create.mockReturnValue(mockMovement);
        StockMovementRepository_1.StockMovementRepository.save.mockResolvedValue(mockMovement);
        const result = await addStockUseCase.execute(1, 5);
        expect(result).toHaveProperty("id", 1);
        expect(PartRepository_1.PartRepository.save).toHaveBeenCalledWith({ ...mockPart, stock: 15 });
        expect(StockMovementRepository_1.StockMovementRepository.save).toHaveBeenCalled();
    });
    it("deve lançar erro se peça não for encontrada", async () => {
        PartRepository_1.PartRepository.findOne.mockResolvedValue(null);
        await expect(addStockUseCase.execute(999, 5)).rejects.toThrow("Peça não encontrada");
    });
    it("deve usar descrição personalizada quando fornecida", async () => {
        const mockPart = {
            id: 1,
            name: "Filtro de óleo",
            price: 50,
            stock: 10
        };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(mockPart);
        PartRepository_1.PartRepository.save.mockResolvedValue({ ...mockPart, stock: 15 });
        StockMovementRepository_1.StockMovementRepository.create.mockReturnValue({});
        StockMovementRepository_1.StockMovementRepository.save.mockResolvedValue({});
        await addStockUseCase.execute(1, 5, "Compra realizada");
        expect(StockMovementRepository_1.StockMovementRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            description: "Compra realizada"
        }));
    });
});
