"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceOrderRepository_1 = require("../../../../infrastructure/repositories/ServiceOrderRepository");
const ListServiceOrdersUseCase_1 = require("../ListServiceOrdersUseCase");
jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
    ServiceOrderRepository: {
        find: jest.fn(),
    }
}));
describe("ListServiceOrdersUseCase", () => {
    let listServiceOrdersUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        listServiceOrdersUseCase = new ListServiceOrdersUseCase_1.ListServiceOrdersUseCase();
    });
    it("deve listar ordens", async () => {
        ServiceOrderRepository_1.ServiceOrderRepository.find.mockResolvedValue([
            {
                id: 1,
                services: [{ price: "100" }],
                parts: [{ price: "50" }]
            },
            {
                id: 2,
                services: [],
                parts: []
            }
        ]);
        const result = await listServiceOrdersUseCase.execute();
        expect(result.length).toBe(2);
        expect(result[0].services[0].price).toBe(100);
    });
});
