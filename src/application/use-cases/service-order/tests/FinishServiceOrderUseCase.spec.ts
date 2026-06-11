import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { FinishServiceOrderUseCase } from "../FinishServiceOrderUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

describe("FinishServiceOrderUseCase", () => {
  let finishServiceOrderUseCase: FinishServiceOrderUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    finishServiceOrderUseCase = new FinishServiceOrderUseCase();
  });

  it("deve finalizar ordem em execução", async () => {
    const mockOrder = {
      id: 1,
      status: "EM_EXECUCAO",
      approved: true
    };
    const finishedOrder = { ...mockOrder, status: "FINALIZADA", finishedAt: new Date() };

    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);
    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(finishedOrder);

    const result = await finishServiceOrderUseCase.execute(1);

    expect(result.status).toBe("FINALIZADA");
  });

  it("não deve finalizar ordem não aprovada", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      approved: false
    });

    await expect(finishServiceOrderUseCase.execute(1)).rejects.toThrow(
      "Não pode finalizar antes da aprovação"
    );
  });

  it("não deve finalizar ordem fora de execução", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      approved: true,
      status: "RECEBIDA"
    });

    await expect(finishServiceOrderUseCase.execute(1)).rejects.toThrow(
      "Ordem precisa estar em execução"
    );
  });
});