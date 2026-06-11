import { ClientRepository } from "../../../../infrastructure/repositories/ClientRepository";
import { VehicleRepository } from "../../../../infrastructure/repositories/VehicleRepository";
import { CreateVehicleUseCase } from "../CreateVehicleUseCase";


jest.mock("../../../../infrastructure/repositories/ClientRepository", () => ({
  ClientRepository: {
    findOne: jest.fn(),
  }
}));

jest.mock("../../../../infrastructure/repositories/VehicleRepository", () => ({
  VehicleRepository: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }
}));

describe("CreateVehicleUseCase", () => {
  let createVehicleUseCase: CreateVehicleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createVehicleUseCase = new CreateVehicleUseCase();
  });

  it("deve criar veículo com sucesso", async () => {
    const mockClient = { id: 1, document: "12345678901", name: "João Silva" };
    const mockVehicle = { id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020 };

    (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
    (VehicleRepository.findOne as jest.Mock).mockResolvedValue(null);
    (VehicleRepository.create as jest.Mock).mockReturnValue(mockVehicle);
    (VehicleRepository.save as jest.Mock).mockResolvedValue(mockVehicle);

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
    (ClientRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      createVehicleUseCase.execute({
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
      createVehicleUseCase.execute({
        plate: "ABC1234",
        brand: "Fiat",
        model: "Uno",
        year: 2020,
        clientDocument: "12345678901"
      })
    ).rejects.toThrow("Veículo já cadastrado");
  });
});