"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const DeliverServiceOrderUseCase_1 = require("../DeliverServiceOrderUseCase");
jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        findOne: jest.fn(),
        save: jest.fn(),
    }
}));
describe("DeliverServiceOrderUseCase", () => {
    let deliverServiceOrderUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        deliverServiceOrderUseCase = new DeliverServiceOrderUseCase_1.DeliverServiceOrderUseCase();
    });
    it("deve entregar ordem finalizada", async () => {
        const mockOrder = { id: 1, status: "FINALIZADA" };
        const deliveredOrder = { ...mockOrder, status: "ENTREGUE" };
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue(mockOrder);
        ServiceOrderRepository_1.ServiceOrderRepository.save.mockResolvedValue(deliveredOrder);
        const result = await deliverServiceOrderUseCase.execute(1);
        expect(result.status).toBe("ENTREGUE");
    });
    it("não deve entregar ordem não finalizada", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            status: "EM_EXECUCAO"
        });
        await expect(deliverServiceOrderUseCase.execute(1)).rejects.toThrow("Só é possível entregar OS finalizada");
    });
});
