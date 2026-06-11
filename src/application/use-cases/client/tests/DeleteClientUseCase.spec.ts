import { DeleteClientUseCase } from "../DeleteClientUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("DeleteClientUseCase", () => {
  let useCase: DeleteClientUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      softDelete: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new DeleteClientUseCase();
  });

  it("deve remover cliente com sucesso (soft delete)", async () => {
    const client = { id: 1, name: "João" };
    mockRepo.findOne.mockResolvedValue(client);
    mockRepo.softDelete.mockResolvedValue(undefined);

    const result = await useCase.execute(1);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockRepo.softDelete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: "Cliente removido com sucesso" });
  });

  it("deve lançar erro se cliente não encontrado", async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow("Cliente não encontrado");
    expect(mockRepo.softDelete).not.toHaveBeenCalled();
  });
});