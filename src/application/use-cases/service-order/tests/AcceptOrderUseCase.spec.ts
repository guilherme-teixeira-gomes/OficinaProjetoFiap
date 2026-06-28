import { AcceptOrderUseCase } from "../AcceptOrderUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("AcceptOrderUseCase", () => {
  let useCase: AcceptOrderUseCase;
  let mockUserRepo: any;
  let mockOrderRepo: any;

  beforeEach(() => {
    mockUserRepo = { findOne: jest.fn() };
    mockOrderRepo = { findOne: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockUserRepo)
      .mockImplementationOnce(() => mockOrderRepo);
    useCase = new AcceptOrderUseCase();
  });

  it("deve aceitar ordem e mudar status para EM_DIAGNOSTICO", async () => {
    const mockMechanic = { id: 1, role: "mecanico" };
    const mockOrder = { id: 1, status: "RECEBIDA", mechanicId: null };
    const updatedOrder = { ...mockOrder, status: "EM_DIAGNOSTICO", mechanicId: 1 };

    mockUserRepo.findOne.mockResolvedValue(mockMechanic);
    mockOrderRepo.findOne.mockResolvedValueOnce(mockOrder).mockResolvedValueOnce(updatedOrder);
    mockOrderRepo.save.mockResolvedValue(updatedOrder);

    const result = await useCase.execute(1, 1);
    expect(result).toHaveProperty("status", "EM_DIAGNOSTICO");
  });

  it("não deve aceitar ordem se mecânico não for encontrado", async () => {
    mockUserRepo.findOne.mockResolvedValue(null);
    await expect(useCase.execute(1, 1)).rejects.toThrow("Mecânico não encontrado ou não autorizado");
  });

  it("não deve aceitar ordem já aceita", async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 1, role: "mecanico" });
    mockOrderRepo.findOne.mockResolvedValue({ id: 1, status: "RECEBIDA", mechanicId: 2 });
    await expect(useCase.execute(1, 1)).rejects.toThrow("Esta OS já foi aceita por outro mecânico");
  });

  it("não deve aceitar ordem com status diferente de RECEBIDA", async () => {
    mockUserRepo.findOne.mockResolvedValue({ id: 1, role: "mecanico" });
    mockOrderRepo.findOne.mockResolvedValue({ id: 1, status: "EM_EXECUCAO", mechanicId: null });
    await expect(useCase.execute(1, 1)).rejects.toThrow("Ordem de serviço precisa estar com status RECEBIDA");
  });
});