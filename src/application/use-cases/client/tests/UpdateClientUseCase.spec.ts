import { UpdateClientUseCase } from "../UpdateClientUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("UpdateClientUseCase", () => {
  let useCase: UpdateClientUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new UpdateClientUseCase();
  });

  it("deve atualizar cliente com sucesso", async () => {
    const client = { id: 1, name: "João", email: "joao@test.com", phone: "11999999999" };
    mockRepo.findOne.mockResolvedValue(client);
    mockRepo.save.mockResolvedValue({ ...client, phone: "11888888888" });

    const result = await useCase.execute(1, { phone: "11888888888" });

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result.phone).toBe("11888888888");
  });

  it("deve lançar erro se cliente não encontrado", async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(useCase.execute(99, { name: "Novo" })).rejects.toThrow("Cliente não encontrado");
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});