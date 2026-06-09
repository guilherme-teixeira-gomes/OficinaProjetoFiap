import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { DeliverServiceOrderUseCase } from "../DeliverServiceOrderUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

describe("DeliverServiceOrderUseCase", () => {
  let deliverServiceOrderUseCase: DeliverServiceOrderUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    deliverServiceOrderUseCase = new DeliverServiceOrderUseCase();
  });

  it("deve entregar ordem finalizada", async () => {
    const mockOrder = { id: 1, status: "FINALIZADA" };
    const deliveredOrder = { ...mockOrder, status: "ENTREGUE" };

    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);
    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(deliveredOrder);

    const result = await deliverServiceOrderUseCase.execute(1);

    expect(result.status).toBe("ENTREGUE");
  });

  it("não deve entregar ordem não finalizada", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "EM_EXECUCAO"
    });

    await expect(deliverServiceOrderUseCase.execute(1)).rejects.toThrow(
      "Só é possível entregar OS finalizada"
    );
  });
});