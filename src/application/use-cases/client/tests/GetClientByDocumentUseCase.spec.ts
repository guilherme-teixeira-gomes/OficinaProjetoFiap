import { GetClientByDocumentUseCase } from "../GetClientByDocumentUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetClientByDocumentUseCase", () => {
  let useCase: GetClientByDocumentUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetClientByDocumentUseCase();
  });

  it("deve buscar cliente por documento", async () => {
    const mockClient = { id: 1, document: "123" };
    mockRepo.findOne.mockResolvedValue(mockClient);

    const result = await useCase.getByDocument("123");
    expect(result).toHaveProperty("id", 1);
  });

  it("deve retornar null se cliente não existir", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const result = await useCase.getByDocument("999");
    expect(result).toBeNull();
  });
});