import { ClientRepository } from "../../../../infrastructure/repositories/ClientRepository";
import { GetClientByDocumentUseCase } from "../GetClientByDocumentUseCase";


jest.mock("../../../infrastructure/repositories/ClientRepository", () => ({
  ClientRepository: {
    findOne: jest.fn(),
  }
}));

describe("GetClientByDocumentUseCase", () => {
  let getClientByDocumentUseCase: GetClientByDocumentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getClientByDocumentUseCase = new GetClientByDocumentUseCase();
  });

  it("deve buscar cliente por documento", async () => {
    const mockClient = { id: 1, name: "João", document: "12345678901" };

    (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);

    const result = await getClientByDocumentUseCase.getByDocument("12345678901");

    expect(result).toHaveProperty("id", 1);
    expect(ClientRepository.findOne).toHaveBeenCalledWith({ 
      where: { document: "12345678901" }, 
      relations: ["vehicles", "orders"] 
    });
  });

  it("deve retornar null se cliente não existir", async () => {
    (ClientRepository.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getClientByDocumentUseCase.getByDocument("999");

    expect(result).toBeNull();
  });
});