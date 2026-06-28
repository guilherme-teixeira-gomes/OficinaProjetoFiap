import { ListClientsUseCase } from "../ListClientsUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("ListClientsUseCase", () => {
  let useCase: ListClientsUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new ListClientsUseCase();
  });

  it("deve listar clientes com seus relacionamentos", async () => {
    const mockClients = [{ id: 1, name: "Gui" }, { id: 2, name: "Ana" }];
    mockRepo.find.mockResolvedValue(mockClients);

    const result = await useCase.list();
    expect(result).toHaveLength(2);
  });

  it("deve retornar array vazio quando não há clientes", async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await useCase.list();
    expect(result).toHaveLength(0);
  });
});