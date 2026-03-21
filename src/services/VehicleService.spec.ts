import { VehicleService } from "./VehiclesService";
import { VehicleRepository } from "../repositories/VehicleRepository";
import { ClientRepository } from "../repositories/ClientRepository";

jest.mock("../repositories/VehicleRepository", () => ({
  VehicleRepository: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  }
}));

jest.mock("../repositories/ClientRepository", () => ({
  ClientRepository: {
    findOne: jest.fn(),
  }
}));

describe("VehicleService", () => {
  let vehicleService: VehicleService;

  beforeEach(() => {
    jest.clearAllMocks();
    vehicleService = new VehicleService();
  });

  describe("execute", () => {
    it("deve criar veículo com sucesso", async () => {
      const mockClient = { id: 1, document: "12345678901", name: "João Silva" };
      const mockVehicle = { id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020 };

      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
      (VehicleRepository.findOne as jest.Mock).mockResolvedValue(null);
      (VehicleRepository.create as jest.Mock).mockReturnValue(mockVehicle);
      (VehicleRepository.save as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await vehicleService.execute({
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
      (ClientRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        vehicleService.execute({
          plate: "ABC1234",
          brand: "Fiat",
          model: "Uno",
          year: 2020,
          clientDocument: "12345678901"
        })
      ).rejects.toThrow("Cliente não encontrado");
    });

    it("deve lançar erro se veículo já estiver cadastrado", async () => {
      const mockClient = { id: 1, document: "12345678901" };
      const existingVehicle = { id: 2, plate: "ABC1234" };

      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
      (VehicleRepository.findOne as jest.Mock).mockResolvedValue(existingVehicle);

      await expect(
        vehicleService.execute({
          plate: "ABC1234",
          brand: "Fiat",
          model: "Uno",
          year: 2020,
          clientDocument: "12345678901"
        })
      ).rejects.toThrow("Veículo já cadastrado");
    });
  });

  describe("list", () => {
    it("deve listar todos os veículos com seus clientes", async () => {
      const mockVehicles = [
        { id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020, client: { id: 1, name: "João" } },
        { id: 2, plate: "XYZ9090", brand: "Honda", model: "Civic", year: 2022, client: { id: 2, name: "Maria" } }
      ];

      (VehicleRepository.find as jest.Mock).mockResolvedValue(mockVehicles);

      const result = await vehicleService.list();

      expect(result).toHaveLength(2);
      expect(VehicleRepository.find).toHaveBeenCalledWith({ relations: ["client"] });
    });

    it("deve retornar array vazio quando não há veículos", async () => {
      (VehicleRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await vehicleService.list();

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("deve buscar veículo por id com cliente", async () => {
      const mockVehicle = { 
        id: 1, 
        plate: "ABC1234", 
        brand: "Fiat", 
        model: "Uno", 
        year: 2020, 
        client: { id: 1, name: "João" } 
      };

      (VehicleRepository.findOne as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await vehicleService.getById(1);

      expect(result).toHaveProperty("id", 1);
      expect(VehicleRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 }, 
        relations: ["client"] 
      });
    });

    it("deve retornar null se veículo não existir", async () => {
      (VehicleRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await vehicleService.getById(999);

      expect(result).toBeNull();
    });
  });
});