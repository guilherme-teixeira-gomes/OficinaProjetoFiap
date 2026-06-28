import { ApproveOrderUseCase } from "../ApproveServiceOrderUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));
jest.mock("../../../../infrastructure/email/EmailService", () => ({
  sendEmail: jest.fn().mockResolvedValue({}),
  emailStatusAtualizado: jest.fn().mockReturnValue({ subject: "s", html: "h" })
}));
jest.mock("../../../../application/use-cases/stock/CheckStockAvailabilityUseCase", () => ({
  CheckStockAvailabilityUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({ available: true, currentStock: 10 })
  }))
}));
jest.mock("../../../../application/use-cases/stock/ReserveStockUseCase", () => ({
  ReserveStockUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({ partId: 1, quantity: -1 })
  }))
}));
jest.mock("../../../../application/use-cases/stock/RestoreStockUseCase", () => ({
  RestoreStockUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({})
  }))
}));
jest.mock("../../../../application/use-cases/service-execution/CreateExecutionsFromApprovedOrderUseCase", () => ({
  CreateExecutionsFromApprovedOrderUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue([])
  }))
}));

describe("ApproveOrderUseCase", () => {
  let useCase: ApproveOrderUseCase;
  let mockOrderRepo: any;
  let mockServiceRepo: any;
  let mockPartRepo: any;

  beforeEach(() => {
    mockOrderRepo = { findOne: jest.fn(), save: jest.fn() };
    mockServiceRepo = { findByIds: jest.fn().mockResolvedValue([]) };
    mockPartRepo = { findByIds: jest.fn().mockResolvedValue([]) };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockOrderRepo)
      .mockImplementationOnce(() => mockServiceRepo)
      .mockImplementationOnce(() => mockPartRepo);
    useCase = new ApproveOrderUseCase();
  });

  it("deve aprovar ordem e calcular orçamento", async () => {
    const mockOrder = {
      id: 1, status: "AGUARDANDO_APROVACAO", approved: false,
      diagnostics: [{ id: 1, includeInBudget: true, recommendedServices: [], recommendedParts: [] }],
      client: { email: "a@a.com", name: "João" }
    };
    mockOrderRepo.findOne
      .mockResolvedValueOnce(mockOrder)
      .mockResolvedValueOnce({ ...mockOrder, status: "EM_EXECUCAO", approved: true, services: [], parts: [] });
    mockOrderRepo.save.mockResolvedValue({ ...mockOrder, status: "EM_EXECUCAO" });

    const result = await useCase.execute(1);
    expect(result).toHaveProperty("budget");
  });

  it("não deve aprovar se já aprovado", async () => {
    mockOrderRepo.findOne.mockResolvedValue({ id: 1, status: "AGUARDANDO_APROVACAO", approved: true, diagnostics: [{ id: 1 }] });
    await expect(useCase.execute(1)).rejects.toThrow("Orçamento já aprovado");
  });

  it("não deve aprovar se ordem não estiver aguardando aprovação", async () => {
    mockOrderRepo.findOne.mockResolvedValue({ id: 1, status: "RECEBIDA", approved: false, diagnostics: [{ id: 1 }] });
    await expect(useCase.execute(1)).rejects.toThrow("Ordem precisa estar aguardando aprovação");
  });

  it("não deve aprovar se não houver diagnósticos", async () => {
    mockOrderRepo.findOne.mockResolvedValue({ id: 1, status: "AGUARDANDO_APROVACAO", approved: false, diagnostics: [] });
    await expect(useCase.execute(1)).rejects.toThrow("Nenhum diagnóstico encontrado para esta OS");
  });

  it("deve aprovar apenas diagnósticos selecionados", async () => {
    const mockOrder = {
      id: 1, status: "AGUARDANDO_APROVACAO", approved: false,
      diagnostics: [
        { id: 1, includeInBudget: true, recommendedServices: [], recommendedParts: [] },
        { id: 2, includeInBudget: true, recommendedServices: [], recommendedParts: [] }
      ],
      client: null
    };
    mockOrderRepo.findOne
      .mockResolvedValueOnce(mockOrder)
      .mockResolvedValueOnce({ ...mockOrder, status: "EM_EXECUCAO", services: [], parts: [] });
    mockOrderRepo.save.mockResolvedValue({});

    const result = await useCase.execute(1, [1]);
    expect(result).toHaveProperty("budget");
  });
});