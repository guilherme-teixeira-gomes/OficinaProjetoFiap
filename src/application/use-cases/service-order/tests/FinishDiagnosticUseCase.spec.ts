import { FinishDiagnosticUseCase } from "../FinishDiagnosticUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));
jest.mock("../../../../infrastructure/email/EmailService", () => ({
  sendEmail: jest.fn().mockResolvedValue({}),
  emailOrcamentoDisponivel: jest.fn().mockReturnValue({ subject: "s", html: "h" })
}));
jest.mock("../../../../shared/helpers/helpers", () => ({
  calculateBudgetFromDiagnostics: jest.fn().mockResolvedValue(200),
  calculateDiagnosticTotal: jest.fn().mockReturnValue(200),
  validateDocument: jest.fn((d: string) => d),
  validatePlate: jest.fn((p: string) => p)
}));

describe("FinishDiagnosticUseCase", () => {
  let useCase: FinishDiagnosticUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new FinishDiagnosticUseCase();
  });

  it("deve finalizar diagnóstico e gerar orçamento", async () => {
    const mockOrder = {
      id: 1, status: "EM_DIAGNOSTICO",
      client: { email: "a@a.com", name: "João" },
      diagnostics: [{ id: 1, includeInBudget: true, title: "T", description: "D", recommendedServices: [], recommendedParts: [] }]
    };
    mockRepo.findOne.mockResolvedValue(mockOrder);
    mockRepo.save.mockResolvedValue({ ...mockOrder, status: "AGUARDANDO_APROVACAO" });

    const result = await useCase.execute(1);
    expect(result).toHaveProperty("status", "AGUARDANDO_APROVACAO");
    expect(result).toHaveProperty("budget", 200);
  });

  it("não deve finalizar diagnóstico se ordem não estiver em diagnóstico", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, status: "RECEBIDA" });
    await expect(useCase.execute(1)).rejects.toThrow("Ordem de serviço não está em diagnóstico");
  });

  it("deve finalizar diagnóstico com orçamento zero quando não há itens", async () => {
    const mockOrder = { id: 1, status: "EM_DIAGNOSTICO", client: null, diagnostics: [] };
    mockRepo.findOne.mockResolvedValue(mockOrder);
    mockRepo.save.mockResolvedValue({ ...mockOrder, status: "AGUARDANDO_APROVACAO" });

    const result = await useCase.execute(1);
    expect(result).toHaveProperty("status", "AGUARDANDO_APROVACAO");
  });
});