import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { FinishDiagnosticUseCase } from "../FinishDiagnosticUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

describe("FinishDiagnosticUseCase", () => {
  let finishDiagnosticUseCase: FinishDiagnosticUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    finishDiagnosticUseCase = new FinishDiagnosticUseCase();
  });

  it("deve finalizar diagnóstico e gerar orçamento", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "EM_DIAGNOSTICO",
      diagnostics: [
        {
          id: 1,
          includeInBudget: true,
          recommendedServices: [{ price: 100 }],
          recommendedParts: [{ price: 50 }]
        }
      ]
    });

    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});

    const result = await finishDiagnosticUseCase.execute(1);

    expect(result.status).toBe("AGUARDANDO_APROVACAO");
    expect(result.budget).toBe(150);
  });

  it("não deve finalizar diagnóstico se ordem não estiver em diagnóstico", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "FINALIZADA"
    });

    await expect(finishDiagnosticUseCase.execute(1)).rejects.toThrow(
      "Ordem de serviço não está em diagnóstico"
    );
  });

  it("deve finalizar diagnóstico com orçamento zero quando não há itens", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "EM_DIAGNOSTICO",
      diagnostics: []
    });

    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});

    const result = await finishDiagnosticUseCase.execute(1);

    expect(result.budget).toBe(0);
    expect(result.items).toEqual([]);
  });
});