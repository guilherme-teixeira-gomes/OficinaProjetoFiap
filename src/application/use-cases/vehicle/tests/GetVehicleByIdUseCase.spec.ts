import { GetVehicleByIdUseCase } from "../GetVehicleByIdUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetVehicleByIdUseCase", () => {
  let useCase: GetVehicleByIdUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetVehicleByIdUseCase();
  });

  it("deve buscar veículo por id com cliente", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, plate: "ABC1234", client: { id: 1 } });
    const result = await useCase.getById(1);
    expect(result).toHaveProperty("id", 1);
  });

  it("deve retornar null se veículo não existir", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await useCase.getById(999);
    expect(result).toBeNull();
  });
});