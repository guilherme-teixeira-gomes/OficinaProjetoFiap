"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceRepository_1 = require("../../../../infrastructure/repositories/ServiceRepository");
const ListServicesUseCase_1 = require("../ListServicesUseCase");
jest.mock("../../../infrastructure/repositories/ServiceRepository", () => ({
    ServiceRepository: {
        find: jest.fn(),
    }
}));
describe("ListServicesUseCase", () => {
    let listServicesUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        listServicesUseCase = new ListServicesUseCase_1.ListServicesUseCase();
    });
    it("deve listar todos os serviços", async () => {
        const mockServices = [
            { id: 1, name: "Troca de óleo", price: 100 },
            { id: 2, name: "Alinhamento", price: 80 }
        ];
        ServiceRepository_1.ServiceRepository.find.mockResolvedValue(mockServices);
        const result = await listServicesUseCase.list();
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe("Troca de óleo");
        expect(result[1].name).toBe("Alinhamento");
    });
    it("deve retornar array vazio quando não há serviços", async () => {
        ServiceRepository_1.ServiceRepository.find.mockResolvedValue([]);
        const result = await listServicesUseCase.list();
        expect(result).toEqual([]);
    });
});
