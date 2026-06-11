import { UpdateVehicleUseCase } from "../UpdateVehicleUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";
import { validatePlate } from "../../../../shared/helpers/helpers";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock("../../../../shared/helpers/helpers", () => ({
  validatePlate: jest.fn((plate: string) => plate.toUpperCase()),
}));

describe("UpdateVehicleUseCase", () => {
  let useCase: UpdateVehicleUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new UpdateVehicleUseCase();
  });

  it("deve atualizar veículo com sucesso", async () => {
    const vehicle = { id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020 };
    mockRepo.findOne.mockResolvedValueOnce(vehicle);
    mockRepo.save.mockResolvedValue({ ...vehicle, year: 2021 });

    const result = await useCase.execute(1, { year: 2021 });

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result.year).toBe(2021);
  });

  it("deve atualizar placa com sucesso", async () => {
    const vehicle = { id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020 };
    mockRepo.findOne.mockResolvedValueOnce(vehicle);
    mockRepo.findOne.mockResolvedValueOnce(null);
    mockRepo.save.mockResolvedValue({ ...vehicle, plate: "XYZ9876" });

    const result = await useCase.execute(1, { plate: "XYZ9876" });

    expect(validatePlate).toHaveBeenCalledWith("XYZ9876");
    expect(result.plate).toBe("XYZ9876");
  });

  it("deve lançar erro se placa já cadastrada para outro veículo", async () => {
    const vehicle = { id: 1, plate: "ABC1234" };
    const otherVehicle = { id: 2, plate: "XYZ9876" };
    mockRepo.findOne.mockResolvedValueOnce(vehicle);
    mockRepo.findOne.mockResolvedValueOnce(otherVehicle);

    await expect(useCase.execute(1, { plate: "XYZ9876" })).rejects.toThrow("Placa já cadastrada para outro veículo");
  });

  it("deve lançar erro se veículo não encontrado", async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(useCase.execute(99, { brand: "Honda" })).rejects.toThrow("Veículo não encontrado");
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});