import { CreateVehicleUseCase } from "../CreateVehicleUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("CreateVehicleUseCase", () => {
  let useCase: CreateVehicleUseCase;
  let mockVehicleRepo: any;
  let mockClientRepo: any;

  beforeEach(() => {
    mockClientRepo = { findOne: jest.fn() };
    mockVehicleRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockVehicleRepo)
      .mockImplementationOnce(() => mockClientRepo);
    useCase = new CreateVehicleUseCase();
  });

  it("deve criar veículo com sucesso", async () => {
    const mockClient = { id: 1, document: "123" };
    const mockVehicle = { id: 1, plate: "ABC1234", client: mockClient };

    mockClientRepo.findOne.mockResolvedValue(mockClient);
    mockVehicleRepo.findOne.mockResolvedValue(null);
    mockVehicleRepo.create.mockReturnValue(mockVehicle);
    mockVehicleRepo.save.mockResolvedValue(mockVehicle);

    const result = await useCase.execute({ plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020, clientDocument: "123" });
    expect(result).toHaveProperty("id", 1);
  });

  it("deve lançar erro se cliente não existir", async () => {
    mockClientRepo.findOne.mockResolvedValue(null);
    await expect(useCase.execute({ plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020, clientDocument: "999" }))
      .rejects.toThrow("Cliente não encontrado");
  });

  it("deve lançar erro se veículo já estiver cadastrado", async () => {
    mockClientRepo.findOne.mockResolvedValue({ id: 1 });
    mockVehicleRepo.findOne.mockResolvedValue({ id: 1, plate: "ABC1234" });
    await expect(useCase.execute({ plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020, clientDocument: "123" }))
      .rejects.toThrow("Veículo já cadastrado");
  });
});