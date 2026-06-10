import { ServiceRepository } from "../../../../infrastructure/repositories/ServiceRepository";
import { DeleteServiceUseCase } from "../DeleteServiceUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceRepository", () => ({
  ServiceRepository: {
    findOne: jest.fn(),
    remove: jest.fn(),
  }
}));

describe("DeleteServiceUseCase", () => {
  let deleteServiceUseCase: DeleteServiceUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteServiceUseCase = new DeleteServiceUseCase();
  });

  it("deve deletar serviço com sucesso", async () => {
    const existingService = { id: 1, name: "Troca de óleo", price: 100 };

    (ServiceRepository.findOne as jest.Mock).mockResolvedValue(existingService);
    (ServiceRepository.remove as jest.Mock).mockResolvedValue(existingService);

    await deleteServiceUseCase.delete(1);

    expect(ServiceRepository.remove).toHaveBeenCalledWith(existingService);
  });

  it("deve lançar erro ao deletar serviço inexistente", async () => {
    (ServiceRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(deleteServiceUseCase.delete(999)).rejects.toThrow(
      "Serviço não encontrado"
    );
  });
});