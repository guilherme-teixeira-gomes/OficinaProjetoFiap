"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const GetServiceOrderByIdUseCase_1 = require("../GetServiceOrderByIdUseCase");
jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        findOne: jest.fn(),
    }
}));
describe("GetServiceOrderByIdUseCase", () => {
    let getServiceOrderByIdUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        getServiceOrderByIdUseCase = new GetServiceOrderByIdUseCase_1.GetServiceOrderByIdUseCase();
    });
    it("deve buscar ordem por id", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue({
            id: 1,
            client: { id: 1 },
            vehicle: { id: 1 },
            services: [],
            parts: [],
            executions: []
        });
        const result = await getServiceOrderByIdUseCase.execute(1);
        expect(result).toHaveProperty("id", 1);
    });
    it("deve retornar null se ordem não existir", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.findOne.mockResolvedValue(null);
        const result = await getServiceOrderByIdUseCase.execute(999);
        expect(result).toBeNull();
    });
});
