import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { ServiceRepository } from "../../../../infrastructure/repositories/ServiceRepository";
import { CreateExecutionsFromApprovedOrderUseCase } from "../../service-execution/CreateExecutionsFromApprovedOrderUseCase";
import { CheckStockAvailabilityUseCase } from "../../stock/CheckStockAvailabilityUseCase";
import { ReserveStockUseCase } from "../../stock/ReserveStockUseCase";
import { ApproveOrderUseCase } from "../ApproveServiceOrderUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceRepository", () => ({
  ServiceRepository: {
    findByIds: jest.fn(),
  }
}));

jest.mock("../../../../infrastructure/repositories/PartRepository", () => ({
  PartRepository: {
    findByIds: jest.fn(),
  }
}));

jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

jest.mock("../../stock/CheckStockAvailabilityUseCase");
jest.mock("../../stock/ReserveStockUseCase");
jest.mock("../../stock/RestoreStockUseCase");
jest.mock("../../service-execution/CreateExecutionsFromApprovedOrderUseCase");

describe("ApproveOrderUseCase", () => {
  let approveOrderUseCase: ApproveOrderUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    approveOrderUseCase = new ApproveOrderUseCase();
  });

  it("deve aprovar ordem e calcular orçamento", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "AGUARDANDO_APROVACAO",
      approved: false,
      diagnostics: [
        {
          id: 1,
          includeInBudget: true,
          recommendedServices: [{ id: 10, price: 100 }],
          recommendedParts: [{ id: 20, price: 50 }]
        }
      ]
    });

    (ServiceRepository.findByIds as jest.Mock).mockResolvedValue([
      { id: 10, price: 100 }
    ]);

    (PartRepository.findByIds as jest.Mock).mockResolvedValue([
      { id: 20, price: 50 }
    ]);

    (CheckStockAvailabilityUseCase.prototype.execute as jest.Mock).mockResolvedValue({
      available: true,
      currentStock: 10
    });

    (ReserveStockUseCase.prototype.execute as jest.Mock).mockResolvedValue({ id: 1 });
    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});
    (CreateExecutionsFromApprovedOrderUseCase.prototype.execute as jest.Mock).mockResolvedValue([]);

    const result = await approveOrderUseCase.execute(1);

    expect(result.budget).toBe(150);
  });

  it("deve aprovar apenas diagnósticos selecionados", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "AGUARDANDO_APROVACAO",
      approved: false,
      diagnostics: [
        {
          id: 1,
          includeInBudget: true,
          recommendedServices: [{ id: 10, price: 100 }],
          recommendedParts: []
        },
        {
          id: 2,
          includeInBudget: true,
          recommendedServices: [{ id: 20, price: 200 }],
          recommendedParts: []
        }
      ]
    });

    (ServiceRepository.findByIds as jest.Mock).mockResolvedValue([
      { id: 10, price: 100 }
    ]);

    (PartRepository.findByIds as jest.Mock).mockResolvedValue([]);
    (CheckStockAvailabilityUseCase.prototype.execute as jest.Mock).mockResolvedValue({
      available: true,
      currentStock: 10
    });
    (ReserveStockUseCase.prototype.execute as jest.Mock).mockResolvedValue({ id: 1 });
    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});
    (CreateExecutionsFromApprovedOrderUseCase.prototype.execute as jest.Mock).mockResolvedValue([]);

    const result = await approveOrderUseCase.execute(1, [1]);

    expect(result.budget).toBe(100);
  });

  it("não deve aprovar se já aprovado", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      approved: true
    });

    await expect(approveOrderUseCase.execute(1)).rejects.toThrow("Orçamento já aprovado");
  });

  it("não deve aprovar se ordem não estiver aguardando aprovação", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      approved: false,
      status: "EM_EXECUCAO"
    });

    await expect(approveOrderUseCase.execute(1)).rejects.toThrow(
      "Ordem precisa estar aguardando aprovação"
    );
  });

  it("não deve aprovar se não houver diagnósticos", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "AGUARDANDO_APROVACAO",
      approved: false,
      diagnostics: []
    });

    await expect(approveOrderUseCase.execute(1)).rejects.toThrow(
      "Nenhum diagnóstico encontrado para esta OS"
    );
  });
});