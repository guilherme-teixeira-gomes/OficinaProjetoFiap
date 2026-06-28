import { CreateServiceOrderUseCase } from "../CreateServiceOrderUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("CreateServiceOrderUseCase", () => {
  let useCase: CreateServiceOrderUseCase;
  let mockOrderRepo: any;
  let mockClientRepo: any;
  let mockVehicleRepo: any;

  const VALID_CPF = "529.982.247-25";

  beforeEach(() => {
    jest.clearAllMocks();
    mockOrderRepo = { create: jest.fn(), save: jest.fn(), findOne: jest.fn() };
    mockClientRepo = { findOne: jest.fn(), save: jest.fn() };
    mockVehicleRepo = { findOne: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockOrderRepo)
      .mockImplementationOnce(() => mockClientRepo)
      .mockImplementationOnce(() => mockVehicleRepo);
    useCase = new CreateServiceOrderUseCase();
  });

  describe("execute", () => {
    it("deve criar novo cliente e veículo", async () => {
      const mockClient = { id: 1, name: "João", document: "52998224725", email: "joao@test.com", phone: "11999990001" };
      const mockVehicle = { id: 1, plate: "ABC1234", client: mockClient };
      const mockOrder = { id: 1, status: "RECEBIDA", client: mockClient, vehicle: mockVehicle, services: [], parts: [], mechanic: null };

      mockClientRepo.findOne.mockResolvedValue(null);
      mockClientRepo.save.mockResolvedValue(mockClient);
      mockVehicleRepo.save.mockResolvedValue(mockVehicle);
      mockOrderRepo.create.mockReturnValue(mockOrder);
      mockOrderRepo.save.mockResolvedValue(mockOrder);
      mockOrderRepo.findOne.mockResolvedValue(mockOrder);

      const result = await useCase.create({
        client: { document: VALID_CPF, name: "João", email: "joao@test.com", phone: "11999990001" },
        vehicle: { plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020 }
      });

      expect(result).toHaveProperty("id", 1);
      expect(result).toHaveProperty("status", "RECEBIDA");
    });

    it("deve retornar lista de veículos quando cliente existe mas veículo não especificado", async () => {
      const mockClient = { id: 1, document: "52998224725", vehicles: [{ id: 1, plate: "ABC1234" }] };
      mockClientRepo.findOne.mockResolvedValue(mockClient);

      const result: any = await useCase.create({
        client: { document: VALID_CPF },
        vehicle: {}
      });

      expect(result).toHaveProperty("success", true);
      expect(result.data.vehicles.length).toBe(1);
    });

    it("deve criar cliente com CNPJ válido", async () => {
      const mockClient = { id: 2, name: "Empresa", document: "12345678000195", email: "empresa@test.com", phone: "1133330001" };
      const mockVehicle = { id: 2, plate: "XYZ9999", client: mockClient };
      const mockOrder = { id: 2, status: "RECEBIDA", client: mockClient, vehicle: mockVehicle, services: [], parts: [], mechanic: null };

      mockClientRepo.findOne.mockResolvedValue(null);
      mockClientRepo.save.mockResolvedValue(mockClient);
      mockVehicleRepo.save.mockResolvedValue(mockVehicle);
      mockOrderRepo.create.mockReturnValue(mockOrder);
      mockOrderRepo.save.mockResolvedValue(mockOrder);
      mockOrderRepo.findOne.mockResolvedValue(mockOrder);

      const result = await useCase.create({
        client: { document: "12.345.678/0001-95", name: "Empresa", email: "empresa@test.com", phone: "1133330001" },
        vehicle: { plate: "XYZ9999", brand: "Ford", model: "Ka", year: 2021 }
      });

      expect(result).toHaveProperty("id", 2);
    });
  });
});