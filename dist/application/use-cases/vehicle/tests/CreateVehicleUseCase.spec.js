"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientRepository_1 = require("../../../../infrastructure/repositories/ClientRepository");
const VehicleRepository_1 = require("../../../../infrastructure/repositories/VehicleRepository");
const CreateVehicleUseCase_1 = require("../CreateVehicleUseCase");
jest.mock("../../../infrastructure/repositories/ClientRepository", () => ({
    ClientRepository: {
        findOne: jest.fn(),
    }
}));
jest.mock("../../../infrastructure/repositories/VehicleRepository", () => ({
    VehicleRepository: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    }
}));
describe("CreateVehicleUseCase", () => {
    let createVehicleUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        createVehicleUseCase = new CreateVehicleUseCase_1.CreateVehicleUseCase();
    });
    it("deve criar veículo com sucesso", async () => {
        const mockClient = { id: 1, document: "12345678901", name: "João Silva" };
        const mockVehicle = { id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020 };
        ClientRepository_1.ClientRepository.findOne.mockResolvedValue(mockClient);
        VehicleRepository_1.VehicleRepository.findOne.mockResolvedValue(null);
        VehicleRepository_1.VehicleRepository.create.mockReturnValue(mockVehicle);
        VehicleRepository_1.VehicleRepository.save.mockResolvedValue(mockVehicle);
        const result = await createVehicleUseCase.execute({
            plate: "ABC1234",
            brand: "Fiat",
            model: "Uno",
            year: 2020,
            clientDocument: "12345678901"
        });
        expect(result).toHaveProperty("id", 1);
        expect(result.plate).toBe("ABC1234");
    });
    it("deve lançar erro se cliente não existir", async () => {
        ClientRepository_1.ClientRepository.findOne.mockResolvedValue(null);
        await expect(createVehicleUseCase.execute({
            plate: "ABC1234",
            brand: "Fiat",
            model: "Uno",
            year: 2020,
            clientDocument: "12345678901"
        })).rejects.toThrow("Cliente não encontrado");
    });
    it("deve lançar erro se veículo já estiver cadastrado", async () => {
        const mockClient = { id: 1, document: "12345678901" };
        const existingVehicle = { id: 2, plate: "ABC1234" };
        ClientRepository_1.ClientRepository.findOne.mockResolvedValue(mockClient);
        VehicleRepository_1.VehicleRepository.findOne.mockResolvedValue(existingVehicle);
        await expect(createVehicleUseCase.execute({
            plate: "ABC1234",
            brand: "Fiat",
            model: "Uno",
            year: 2020,
            clientDocument: "12345678901"
        })).rejects.toThrow("Veículo já cadastrado");
    });
});
