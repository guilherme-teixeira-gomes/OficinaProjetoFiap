import { DeleteVehicleUseCase } from "../DeleteVehicleUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("DeleteVehicleUseCase", () => {
  let useCase: DeleteVehicleUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      softDelete: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new DeleteVehicleUseCase();
  });

  it("deve remover veículo com sucesso (soft delete)", async () => {
    const vehicle = { id: 1, plate: "ABC1234", serviceOrders: [] };
    mockRepo.findOne.mockResolvedValue(vehicle);
    mockRepo.softDelete.mockResolvedValue(undefined);

    const result = await useCase.execute(1);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ["serviceOrders"] });
    expect(mockRepo.softDelete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: "Veículo removido com sucesso" });
  });

  it("deve lançar erro se veículo não encontrado", async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow("Veículo não encontrado");
    expect(mockRepo.softDelete).not.toHaveBeenCalled();
  });
});