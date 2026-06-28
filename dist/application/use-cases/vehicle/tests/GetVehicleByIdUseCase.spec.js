"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VehicleRepository_1 = require("../../../../infrastructure/repositories/VehicleRepository");
const GetVehicleByIdUseCase_1 = require("../GetVehicleByIdUseCase");
jest.mock("../../../../infrastructure/repositories/VehicleRepository", () => ({
    VehicleRepository: {
        findOne: jest.fn(),
    }
}));
describe("GetVehicleByIdUseCase", () => {
    let getVehicleByIdUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        getVehicleByIdUseCase = new GetVehicleByIdUseCase_1.GetVehicleByIdUseCase();
    });
    it("deve buscar veículo por id com cliente", async () => {
        const mockVehicle = {
            id: 1,
            plate: "ABC1234",
            brand: "Fiat",
            model: "Uno",
            year: 2020,
            client: { id: 1, name: "João" }
        };
        VehicleRepository_1.VehicleRepository.findOne.mockResolvedValue(mockVehicle);
        const result = await getVehicleByIdUseCase.getById(1);
        expect(result).toHaveProperty("id", 1);
        expect(VehicleRepository_1.VehicleRepository.findOne).toHaveBeenCalledWith({
            where: { id: 1 },
            relations: ["client"]
        });
    });
    it("deve retornar null se veículo não existir", async () => {
        VehicleRepository_1.VehicleRepository.findOne.mockResolvedValue(null);
        const result = await getVehicleByIdUseCase.getById(999);
        expect(result).toBeNull();
    });
});
