import { ServiceRepository } from "../../../../infrastructure/repositories/ServiceRepository";
import { UpdateServiceUseCase } from "../UpdateServiceUseCase";

jest.mock("../../../../infrastructure/repositories/ServiceRepository", () => ({
  ServiceRepository: {
    findOne: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
  }
}));

describe("UpdateServiceUseCase", () => {
  let updateServiceUseCase: UpdateServiceUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    updateServiceUseCase = new UpdateServiceUseCase();
  });

  it("deve atualizar serviço com sucesso", async () => {
    const existingService = { id: 1, name: "Troca de óleo", price: 100 };
    const updatedService = { ...existingService, price: 120 };

    (ServiceRepository.findOne as jest.Mock).mockResolvedValue(existingService);
    (ServiceRepository.merge as jest.Mock).mockReturnValue(updatedService);
    (ServiceRepository.save as jest.Mock).mockResolvedValue(updatedService);

    const result = await updateServiceUseCase.update(1, { price: 120 });

    expect(result.price).toBe(120);
    expect(ServiceRepository.merge).toHaveBeenCalledWith(existingService, { price: 120 });
  });

  it("deve atualizar múltiplos campos", async () => {
    const existingService = { id: 1, name: "Troca de óleo", price: 100, active: true };
    const updatedService = {
      ...existingService,
      name: "Troca de óleo sintético",
      price: 150
    };

    (ServiceRepository.findOne as jest.Mock).mockResolvedValue(existingService);
    (ServiceRepository.merge as jest.Mock).mockReturnValue(updatedService);
    (ServiceRepository.save as jest.Mock).mockResolvedValue(updatedService);

    const result = await updateServiceUseCase.update(1, {
      name: "Troca de óleo sintético",
      price: 150
    });

    expect(result.name).toBe("Troca de óleo sintético");
    expect(result.price).toBe(150);
  });

  it("deve lançar erro ao atualizar serviço inexistente", async () => {
    (ServiceRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      updateServiceUseCase.update(999, { price: 120 })
    ).rejects.toThrow("Serviço não encontrado");
  });
});