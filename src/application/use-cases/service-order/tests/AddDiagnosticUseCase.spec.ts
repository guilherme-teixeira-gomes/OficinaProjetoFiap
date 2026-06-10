import { DiagnosticRepository } from "../../../../infrastructure/repositories/DiagnosticRepository";
import { PartRepository } from "../../../../infrastructure/repositories/PartRepository";
import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { ServiceRepository } from "../../../../infrastructure/repositories/ServiceRepository";
import { AddDiagnosticUseCase } from "../AddDiagnosticUseCase";


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
  }
}));

jest.mock("../../../../infrastructure/repositories/DiagnosticRepository", () => ({
  DiagnosticRepository: {
    create: jest.fn(),
    save: jest.fn(),
  }
}));

describe("AddDiagnosticUseCase", () => {
  let addDiagnosticUseCase: AddDiagnosticUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    addDiagnosticUseCase = new AddDiagnosticUseCase();
  });

  it("deve adicionar diagnóstico", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "EM_DIAGNOSTICO",
      diagnostics: []
    });

    (ServiceRepository.findByIds as jest.Mock).mockResolvedValue([{ id: 1, price: 100 }]);
    (PartRepository.findByIds as jest.Mock).mockResolvedValue([{ id: 2, price: 50 }]);

    (DiagnosticRepository.create as jest.Mock).mockReturnValue({ id: 99 });
    (DiagnosticRepository.save as jest.Mock).mockResolvedValue({ id: 99 });

    const result = await addDiagnosticUseCase.execute(1, {
      title: "Teste",
      description: "desc",
      includeInBudget: true,
      priority: "alta",
      serviceIds: [1],
      partIds: [2]
    });

    expect(result).toHaveProperty("id", 99);
  });

  it("não deve adicionar diagnóstico fora do status correto", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "FINALIZADA"
    });

    await expect(
      addDiagnosticUseCase.execute(1, {} as any)
    ).rejects.toThrow("Só é possível adicionar diagnósticos em status EM_DIAGNOSTICO");
  });
});