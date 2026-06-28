import { UpdateServiceUseCase } from "../UpdateServiceUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("UpdateServiceUseCase", () => {
  let useCase: UpdateServiceUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), merge: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new UpdateServiceUseCase();
  });

  it("deve atualizar serviço com sucesso", async () => {
    const mockService = { id: 1, name: "Troca de óleo", price: 150 };
    mockRepo.findOne.mockResolvedValue(mockService);
    mockRepo.save.mockResolvedValue({ ...mockService, price: 200 });

    await useCase.update(1, { price: 200 });
    expect(mockRepo.merge).toHaveBeenCalledWith(mockService, { price: 200 });
  });

  it("deve atualizar múltiplos campos", async () => {
    const mockService = { id: 1, name: "Troca de óleo", price: 150, active: true };
    mockRepo.findOne.mockResolvedValue(mockService);
    mockRepo.save.mockResolvedValue({ ...mockService, price: 200, active: false });

    await useCase.update(1, { price: 200, active: false });
    expect(mockRepo.merge).toHaveBeenCalledWith(mockService, { price: 200, active: false });
  });

  it("deve lançar erro ao atualizar serviço inexistente", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(useCase.update(999, { price: 200 })).rejects.toThrow("Serviço não encontrado");
  });
});