"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PartRepository_1 = require("../../../../infrastructure/repositories/PartRepository");
const StockMovementRepository_1 = require("../../../../infrastructure/repositories/StockMovementRepository");
const ReserveStockUseCase_1 = require("../ReserveStockUseCase");
jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
    PartRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
    }
}));
jest.mock("../../../../infrastructure/repositories/StockMovementRepository", () => ({
    StockMovementRepository: {
        create: jest.fn(),
        save: jest.fn(),
    }
}));
describe("ReserveStockUseCase", () => {
    let reserveStockUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        reserveStockUseCase = new ReserveStockUseCase_1.ReserveStockUseCase();
    });
    it("deve reservar estoque com sucesso", async () => {
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
            quantity: -3,
            type: "OUT",
            unitPrice: 50,
            totalValue: 150,
            serviceOrderId: 100,
            description: "Baixa para OS #100 - Filtro de óleo (3 unidade(s))",
            status: "CONFIRMADO"
        };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(mockPart);
        PartRepository_1.PartRepository.save.mockResolvedValue({ ...mockPart, stock: 7 });
        StockMovementRepository_1.StockMovementRepository.create.mockReturnValue(mockMovement);
        StockMovementRepository_1.StockMovementRepository.save.mockResolvedValue(mockMovement);
        const result = await reserveStockUseCase.execute(1, 3, 100);
        expect(result).toHaveProperty("id", 1);
        expect(PartRepository_1.PartRepository.save).toHaveBeenCalledWith({ ...mockPart, stock: 7 });
    });
    it("deve lançar erro se peça não for encontrada", async () => {
        PartRepository_1.PartRepository.findOne.mockResolvedValue(null);
        await expect(reserveStockUseCase.execute(999, 5, 100)).rejects.toThrow("Peça não encontrada");
    });
    it("deve lançar erro se estoque for insuficiente", async () => {
        const mockPart = {
            id: 1,
            name: "Filtro de óleo",
            stock: 2
        };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(mockPart);
        await expect(reserveStockUseCase.execute(1, 5, 100)).rejects.toThrow("Estoque insuficiente para Filtro de óleo");
    });
    it("deve usar descrição personalizada quando fornecida", async () => {
        const mockPart = {
            id: 1,
            name: "Filtro de óleo",
            price: 50,
            stock: 10
        };
        PartRepository_1.PartRepository.findOne.mockResolvedValue(mockPart);
        PartRepository_1.PartRepository.save.mockResolvedValue({ ...mockPart, stock: 7 });
        StockMovementRepository_1.StockMovementRepository.create.mockReturnValue({});
        StockMovementRepository_1.StockMovementRepository.save.mockResolvedValue({});
        await reserveStockUseCase.execute(1, 3, 100, "Reserva personalizada");
        expect(StockMovementRepository_1.StockMovementRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            description: "Reserva personalizada"
        }));
    });
});
