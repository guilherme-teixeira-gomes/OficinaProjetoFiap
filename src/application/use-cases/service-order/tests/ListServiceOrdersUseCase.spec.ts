import { ListServiceOrdersUseCase } from "../ListServiceOrdersUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("ListServiceOrdersUseCase", () => {
  let useCase: ListServiceOrdersUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new ListServiceOrdersUseCase();
  });

  it("deve listar ordens", async () => {
    const mockOrders = [
      { id: 1, status: "RECEBIDA", services: [{ price: 100 }], parts: [], createdAt: new Date() },
      { id: 2, status: "EM_EXECUCAO", services: [], parts: [], createdAt: new Date() }
    ];
    mockRepo.find.mockResolvedValue(mockOrders);

    const result = await useCase.execute();
    expect(result.length).toBe(2);
    // EM_EXECUCAO vem primeiro na ordenação
    expect(result[0].status).toBe("EM_EXECUCAO");
    expect(result[1].services[0].price).toBe(100);
  });
});