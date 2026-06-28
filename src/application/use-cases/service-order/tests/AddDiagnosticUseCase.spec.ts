import { AddDiagnosticUseCase } from "../AddDiagnosticUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("AddDiagnosticUseCase", () => {
  let useCase: AddDiagnosticUseCase;
  let mockOrderRepo: any;
  let mockDiagnosticRepo: any;
  let mockServiceRepo: any;
  let mockPartRepo: any;

  beforeEach(() => {
    mockOrderRepo = { findOne: jest.fn() };
    mockDiagnosticRepo = { create: jest.fn(), save: jest.fn() };
    mockServiceRepo = { findByIds: jest.fn() };
    mockPartRepo = { findByIds: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockOrderRepo)
      .mockImplementationOnce(() => mockDiagnosticRepo)
      .mockImplementationOnce(() => mockServiceRepo)
      .mockImplementationOnce(() => mockPartRepo);
    useCase = new AddDiagnosticUseCase();
  });

  it("deve adicionar diagnóstico", async () => {
    const mockOrder = { id: 1, status: "EM_DIAGNOSTICO", diagnostics: [] };
    const mockDiagnostic = { id: 1, title: "Troca de óleo" };
    mockOrderRepo.findOne.mockResolvedValue(mockOrder);
    mockServiceRepo.findByIds.mockResolvedValue([]);
    mockPartRepo.findByIds.mockResolvedValue([]);
    mockDiagnosticRepo.create.mockReturnValue(mockDiagnostic);
    mockDiagnosticRepo.save.mockResolvedValue(mockDiagnostic);

    const result = await useCase.execute(1, { title: "Troca de óleo", description: "Óleo vencido", includeInBudget: true, serviceIds: [], partIds: [] });
    expect(result).toHaveProperty("id", 1);
  });

  it("não deve adicionar diagnóstico fora do status correto", async () => {
    mockOrderRepo.findOne.mockResolvedValue({ id: 1, status: "RECEBIDA" });
    await expect(useCase.execute(1, { title: "Test", description: "Test", includeInBudget: true, serviceIds: [], partIds: [] }))
      .rejects.toThrow("Só é possível adicionar diagnósticos em status EM_DIAGNOSTICO");
  });
});