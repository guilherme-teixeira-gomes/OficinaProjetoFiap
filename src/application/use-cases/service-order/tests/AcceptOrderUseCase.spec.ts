import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { UserRepository } from "../../../../infrastructure/repositories/UserRepository";
import { AcceptOrderUseCase } from "../AcceptOrderUseCase";


jest.mock("../../../../infrastructure/repositories/UserRepository", () => ({
  UserRepository: {
    findOne: jest.fn(),
  }
}));

jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

describe("AcceptOrderUseCase", () => {
  let acceptOrderUseCase: AcceptOrderUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    acceptOrderUseCase = new AcceptOrderUseCase();
  });

  it("deve aceitar ordem e mudar status para EM_DIAGNOSTICO", async () => {
    const mockMechanic = { id: 1, role: "mecanico" };
    const mockOrder = {
      id: 1,
      status: "RECEBIDA",
      mechanicId: null,
      mechanic: null
    };

    const updatedOrder = {
      ...mockOrder,
      status: "EM_DIAGNOSTICO",
      mechanic: mockMechanic,
      mechanicId: 1,
      startedAt: new Date()
    };

    (UserRepository.findOne as jest.Mock).mockResolvedValue(mockMechanic);
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValueOnce(mockOrder);
    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(updatedOrder);
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValueOnce(updatedOrder);

    const result = await acceptOrderUseCase.execute(1, 1);

    expect(result).toHaveProperty("status", "EM_DIAGNOSTICO");
  });

  it("não deve aceitar ordem se mecânico não for encontrado", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(acceptOrderUseCase.execute(1, 1)).rejects.toThrow(
      "Mecânico não encontrado ou não autorizado"
    );
  });

  it("não deve aceitar ordem já aceita", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, role: "mecanico" });
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "RECEBIDA",
      mechanicId: 2
    });

    await expect(acceptOrderUseCase.execute(1, 1)).rejects.toThrow(
      "Esta OS já foi aceita por outro mecânico"
    );
  });

  it("não deve aceitar ordem com status diferente de RECEBIDA", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, role: "mecanico" });
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "EM_EXECUCAO",
      mechanicId: null
    });

    await expect(acceptOrderUseCase.execute(1, 1)).rejects.toThrow(
      "Ordem de serviço precisa estar com status RECEBIDA"
    );
  });
});