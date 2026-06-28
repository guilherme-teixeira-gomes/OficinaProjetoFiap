import { ListServicesUseCase } from "../ListServicesUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("ListServicesUseCase", () => {
  let useCase: ListServicesUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new ListServicesUseCase();
  });

  it("deve listar todos os serviços", async () => {
    mockRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await useCase.list();
    expect(result).toHaveLength(2);
  });

  it("deve retornar array vazio quando não há serviços", async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await useCase.list();
    expect(result).toHaveLength(0);
  });
});