"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceRepository_1 = require("../../../../infrastructure/repositories/ServiceRepository");
const GetServiceByIdUseCase_1 = require("../GetServiceByIdUseCase");
jest.mock("../../../../infrastructure/repositories/ServiceRepository", () => ({
    ServiceRepository: {
        findOne: jest.fn(),
    }
}));
describe("GetServiceByIdUseCase", () => {
    let getServiceByIdUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        getServiceByIdUseCase = new GetServiceByIdUseCase_1.GetServiceByIdUseCase();
    });
    it("deve buscar serviço por id", async () => {
        const mockService = { id: 1, name: "Troca de óleo", price: 100 };
        ServiceRepository_1.ServiceRepository.findOne.mockResolvedValue(mockService);
        const result = await getServiceByIdUseCase.getById(1);
        expect(result).toHaveProperty("id", 1);
        expect(ServiceRepository_1.ServiceRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
    it("deve retornar null se serviço não existir", async () => {
        ServiceRepository_1.ServiceRepository.findOne.mockResolvedValue(null);
        const result = await getServiceByIdUseCase.getById(999);
        expect(result).toBeNull();
    });
});
