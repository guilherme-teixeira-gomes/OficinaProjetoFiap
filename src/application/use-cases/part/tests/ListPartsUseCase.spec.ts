import { ListPartsUseCase } from "../ListPartsUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("ListPartsUseCase", () => {
  let useCase: ListPartsUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new ListPartsUseCase();
  });

  it("deve listar todas as peças", async () => {
    mockRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await useCase.list();
    expect(result).toHaveLength(2);
  });

  it("deve retornar array vazio quando não há peças", async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await useCase.list();
    expect(result).toHaveLength(0);
  });
});