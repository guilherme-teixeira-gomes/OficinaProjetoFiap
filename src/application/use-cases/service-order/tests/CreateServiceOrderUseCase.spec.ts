import { ClientRepository } from "../../../../infrastructure/repositories/ClientRepository";
import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { VehicleRepository } from "../../../../infrastructure/repositories/VehicleRepository";
import { CreateServiceOrderUseCase } from "../CreateServiceOrderUseCase";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      create: jest.fn().mockReturnValue({ id: 1, status: "RECEBIDA", budget: 0 }),
      save: jest.fn().mockResolvedValue({ id: 1, status: "RECEBIDA", budget: 0 }),
      findOne: jest.fn().mockResolvedValue({ id: 1, status: "RECEBIDA", budget: 0 }),
    }),
    isInitialized: true,
  }
}));

jest.mock("../../../../infrastructure/repositories/ClientRepository", () => ({
  ClientRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

jest.mock("../../../../infrastructure/repositories/VehicleRepository", () => ({
  VehicleRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  }
}));

describe("CreateServiceOrderUseCase", () => {
  let createServiceOrderUseCase: CreateServiceOrderUseCase;

  const VALID_CPF = "529.982.247-25";
  const VALID_CNPJ = "12.345.678/0001-95";

  beforeEach(() => {
    jest.clearAllMocks();
    createServiceOrderUseCase = new CreateServiceOrderUseCase();
  });

  describe("execute", () => {
    it("deve criar nova ordem com cliente existente e veículo existente", async () => {
      const mockClient = {
        id: 1,
        name: "João Silva",
        document: VALID_CPF,
        email: "joao@email.com",
        phone: "11999999999",
        vehicles: []
      };

      const mockVehicle = {
        id: 1,
        plate: "ABC1234",
        brand: "Fiat",
        model: "Uno",
        year: 2020
      };

      const mockOrder = {
        id: 1,
        client: mockClient,
        vehicle: mockVehicle,
        status: "RECEBIDA",
        budget: 0
      };

      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
      (VehicleRepository.findOne as jest.Mock).mockResolvedValue(mockVehicle);
      (ServiceOrderRepository.create as jest.Mock).mockReturnValue(mockOrder);
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(mockOrder);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const result = await createServiceOrderUseCase.create({
        client: { document: VALID_CPF },
        vehicle: { id: 1 }
      });

      expect(result).toHaveProperty("id", 1);
    });

    it("deve criar novo cliente e veículo", async () => {
      const mockClient = null;
      const newClient = {
        id: 1,
        name: "Maria Souza",
        document: VALID_CPF,
        email: "maria@email.com",
        phone: "11988888888"
      };

      const newVehicle = {
        id: 1,
        plate: "XYZ9090",
        brand: "Honda",
        model: "Civic",
        year: 2022
      };

      const mockOrder = {
        id: 1,
        client: newClient,
        vehicle: newVehicle,
        status: "RECEBIDA",
        budget: 0
      };

      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
      (ClientRepository.save as jest.Mock).mockResolvedValue(newClient);
      (VehicleRepository.save as jest.Mock).mockResolvedValue(newVehicle);
      (ServiceOrderRepository.create as jest.Mock).mockReturnValue(mockOrder);
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(mockOrder);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const result = await createServiceOrderUseCase.create({
        client: {
          name: "Maria Souza",
          document: VALID_CPF,
          email: "maria@email.com",
          phone: "11988888888"
        },
        vehicle: {
          plate: "XYZ9090",
          brand: "Honda",
          model: "Civic",
          year: 2022
        }
      });

      expect(result).toHaveProperty("id", 1);
    });

    it("deve retornar lista de veículos quando cliente existe mas veículo não especificado", async () => {
      const mockClient = {
        id: 1,
        name: "João Silva",
        document: VALID_CPF,
        email: "joao@email.com",
        phone: "11999999999",
        vehicles: [{ id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020 }]
      };

      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);

      const result = await createServiceOrderUseCase.create({
        client: { document: VALID_CPF },
        vehicle: {}
      });

      if ('success' in result && result.success === true) {
        expect(result.data.vehicles.length).toBe(1);
      } else {
        fail("Expected result to have success property");
      }
    });

    it("deve lançar erro quando CPF é inválido", async () => {
      await expect(
        createServiceOrderUseCase.create({
          client: { document: "123" },
          vehicle: {}
        })
      ).rejects.toThrow("CPF ou CNPJ inválido");
    });

    it("deve lançar erro quando placa é inválida", async () => {
      const mockClient = {
        id: 1,
        document: VALID_CPF
      };
      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);

      await expect(
        createServiceOrderUseCase.create({
          client: { document: VALID_CPF },
          vehicle: { plate: "123" }
        })
      ).rejects.toThrow("Placa de veículo inválida");
    });

    it("deve criar cliente com CNPJ válido", async () => {
      const mockClient = null;
      const newClient = {
        id: 1,
        name: "Empresa LTDA",
        document: VALID_CNPJ,
        email: "empresa@email.com",
        phone: "11988888888"
      };

      const newVehicle = {
        id: 1,
        plate: "XYZ9090",
        brand: "Honda",
        model: "Civic",
        year: 2022
      };

      const mockOrder = {
        id: 1,
        client: newClient,
        vehicle: newVehicle,
        status: "RECEBIDA",
        budget: 0
      };

      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
      (ClientRepository.save as jest.Mock).mockResolvedValue(newClient);
      (VehicleRepository.save as jest.Mock).mockResolvedValue(newVehicle);
      (ServiceOrderRepository.create as jest.Mock).mockReturnValue(mockOrder);
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(mockOrder);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const result = await createServiceOrderUseCase.create({
        client: {
          name: "Empresa LTDA",
          document: VALID_CNPJ,
          email: "empresa@email.com",
          phone: "11988888888"
        },
        vehicle: {
          plate: "XYZ9090",
          brand: "Honda",
          model: "Civic",
          year: 2022
        }
      });

      expect(result).toHaveProperty("id", 1);
    });
  });
});