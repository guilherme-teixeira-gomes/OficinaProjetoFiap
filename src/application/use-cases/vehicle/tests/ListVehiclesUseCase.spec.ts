import { VehicleRepository } from "../../../../infrastructure/repositories/VehicleRepository";
import { ListVehiclesUseCase } from "../ListVehiclesUseCase";

jest.mock("../../../infrastructure/repositories/VehicleRepository", () => ({
  VehicleRepository: {
    find: jest.fn(),
  }
}));

describe("ListVehiclesUseCase", () => {
  let listVehiclesUseCase: ListVehiclesUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listVehiclesUseCase = new ListVehiclesUseCase();
  });

  it("deve listar todos os veículos com seus clientes", async () => {
    const mockVehicles = [
      { id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020, client: { id: 1, name: "João" } },
      { id: 2, plate: "XYZ9090", brand: "Honda", model: "Civic", year: 2022, client: { id: 2, name: "Maria" } }
    ];

    (VehicleRepository.find as jest.Mock).mockResolvedValue(mockVehicles);

    const result = await listVehiclesUseCase.list();

    expect(result).toHaveLength(2);
    expect(VehicleRepository.find).toHaveBeenCalledWith({ relations: ["client"] });
  });

  it("deve retornar array vazio quando não há veículos", async () => {
    (VehicleRepository.find as jest.Mock).mockResolvedValue([]);

    const result = await listVehiclesUseCase.list();

    expect(result).toEqual([]);
  });
});