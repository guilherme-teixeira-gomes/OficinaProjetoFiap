import { VehicleRepository } from "../../../../infrastructure/repositories/VehicleRepository";
import { GetVehicleByIdUseCase } from "../GetVehicleByIdUseCase";


jest.mock("../../../infrastructure/repositories/VehicleRepository", () => ({
  VehicleRepository: {
    findOne: jest.fn(),
  }
}));

describe("GetVehicleByIdUseCase", () => {
  let getVehicleByIdUseCase: GetVehicleByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getVehicleByIdUseCase = new GetVehicleByIdUseCase();
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

    (VehicleRepository.findOne as jest.Mock).mockResolvedValue(mockVehicle);

    const result = await getVehicleByIdUseCase.getById(1);

    expect(result).toHaveProperty("id", 1);
    expect(VehicleRepository.findOne).toHaveBeenCalledWith({ 
      where: { id: 1 }, 
      relations: ["client"] 
    });
  });

  it("deve retornar null se veículo não existir", async () => {
    (VehicleRepository.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getVehicleByIdUseCase.getById(999);

    expect(result).toBeNull();
  });
});