import { ClientRepository } from "../../../../infrastructure/repositories/ClientRepository";
import { CreateClientUseCase } from "../CreateClientUseCase";

jest.mock("../../../../infrastructure/repositories/ClientRepository", () => ({
  ClientRepository: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }
}));

describe("CreateClientUseCase", () => {
  let createClientUseCase: CreateClientUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    createClientUseCase = new CreateClientUseCase();
  });

  it("deve criar cliente com sucesso", async () => {
    (ClientRepository.findOne as jest.Mock).mockResolvedValue(null);

    const mockClient = { id: 1, name: "Gui", document: "123", email: "teste@email.com", phone: "999" };

    (ClientRepository.create as jest.Mock).mockReturnValue(mockClient);
    (ClientRepository.save as jest.Mock).mockResolvedValue(mockClient);

    const result = await createClientUseCase.execute({
      name: "Gui",
      document: "123",
      email: "teste@email.com",
      phone: "999"
    });

    expect(ClientRepository.create).toHaveBeenCalled();
    expect(ClientRepository.save).toHaveBeenCalled();
    expect(result).toHaveProperty("id", 1);
  });

  it("deve lançar erro se cliente já existir", async () => {
    (ClientRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, document: "123" });

    await expect(
      createClientUseCase.execute({
        name: "Gui",
        document: "123",
        email: "teste@email.com",
        phone: "999"
      })
    ).rejects.toThrow("Cliente já cadastrado");
  });
});