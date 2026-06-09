"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VehicleRepository_1 = require("../../../../infrastructure/repositories/VehicleRepository");
const ListVehiclesUseCase_1 = require("../ListVehiclesUseCase");
jest.mock("../../../infrastructure/repositories/VehicleRepository", () => ({
    VehicleRepository: {
        find: jest.fn(),
    }
}));
describe("ListVehiclesUseCase", () => {
    let listVehiclesUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        listVehiclesUseCase = new ListVehiclesUseCase_1.ListVehiclesUseCase();
    });
    it("deve listar todos os veículos com seus clientes", async () => {
        const mockVehicles = [
            { id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020, client: { id: 1, name: "João" } },
            { id: 2, plate: "XYZ9090", brand: "Honda", model: "Civic", year: 2022, client: { id: 2, name: "Maria" } }
        ];
        VehicleRepository_1.VehicleRepository.find.mockResolvedValue(mockVehicles);
        const result = await listVehiclesUseCase.list();
        expect(result).toHaveLength(2);
        expect(VehicleRepository_1.VehicleRepository.find).toHaveBeenCalledWith({ relations: ["client"] });
    });
    it("deve retornar array vazio quando não há veículos", async () => {
        VehicleRepository_1.VehicleRepository.find.mockResolvedValue([]);
        const result = await listVehiclesUseCase.list();
        expect(result).toEqual([]);
    });
});
