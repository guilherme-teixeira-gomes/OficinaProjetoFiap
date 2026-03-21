import { ClientService } from "./ClientService";
import { ClientRepository } from "../repositories/ClientRepository";

jest.mock("../repositories/ClientRepository", () => ({
  ClientRepository: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  }
}));

describe("ClientService", () => {

  it("deve criar cliente com sucesso", async () => {
    (ClientRepository.findOne as jest.Mock).mockResolvedValue(null);
    const mockClient = { id: 1, name: "Gui" };

    (ClientRepository.create as jest.Mock).mockReturnValue(mockClient);
    (ClientRepository.save as jest.Mock).mockResolvedValue(mockClient);

    const service = new ClientService();

    const result = await service.execute({
      name: "Gui",
      document: "123",
      email: "teste@email.com",
      phone: "999"
    });

    expect(result).toHaveProperty("id");
  });

  it("deve lançar erro se cliente já existir", async () => {
    (ClientRepository.findOne as jest.Mock).mockResolvedValue({ id: 1 });

    const service = new ClientService();

    await expect(
      service.execute({
        name: "Gui",
        document: "123",
        email: "teste@email.com",
        phone: "999"
      })
    ).rejects.toThrow("Cliente já cadastrado");
  });

  it("deve listar clientes", async () => {
    (ClientRepository.find as jest.Mock).mockResolvedValue([]);

    const service = new ClientService();
    const result = await service.list();

    expect(result).toEqual([]);
  });

  it("deve buscar por id", async () => {
    (ClientRepository.findOne as jest.Mock).mockResolvedValue({ id: 1 });

    const service = new ClientService();
    const result = await service.getById(1);

    expect(result).toHaveProperty("id");
  });

});