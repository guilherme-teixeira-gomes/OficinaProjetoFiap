import { CreateClientUseCase } from "../CreateClientUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("CreateClientUseCase", () => {
  let useCase: CreateClientUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new CreateClientUseCase();
  });

  it("deve criar cliente com sucesso", async () => {
    const mockClient = { id: 1, name: "Gui", document: "123", email: "teste@email.com", phone: "999" };
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(mockClient);
    mockRepo.save.mockResolvedValue(mockClient);

    const result = await useCase.execute({ name: "Gui", document: "123", email: "teste@email.com", phone: "999" });

    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(result).toHaveProperty("id", 1);
  });

  it("deve lançar erro se cliente já existir", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, document: "123" });

    await expect(useCase.execute({ name: "Gui", document: "123", email: "teste@email.com", phone: "999" }))
      .rejects.toThrow("Cliente já cadastrado");
  });
});