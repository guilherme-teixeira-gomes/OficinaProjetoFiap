import { GetServiceOrderTimelineUseCase } from "../GetServiceOrderTimelineUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetServiceOrderTimelineUseCase", () => {
  let useCase: GetServiceOrderTimelineUseCase;
  let mockExecutionRepo: any;
  let mockOrderRepo: any;

  beforeEach(() => {
    mockExecutionRepo = { find: jest.fn() };
    mockOrderRepo = { findOne: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockExecutionRepo)
      .mockImplementationOnce(() => mockOrderRepo);
    useCase = new GetServiceOrderTimelineUseCase();
  });

  it("deve buscar timeline da ordem", async () => {
    const mockOrder = { id: 1, status: "EM_EXECUCAO", startedAt: null, finishedAt: null };
    const mockExecutions = [
      { serviceId: 1, service: { name: "Troca de óleo" }, status: "CONCLUIDO", startedAt: new Date(), finishedAt: new Date(), durationMinutes: 60 },
      { serviceId: 2, service: { name: "Alinhamento" }, status: "EM_ANDAMENTO", startedAt: new Date(), finishedAt: null, durationMinutes: null }
    ];

    mockExecutionRepo.find.mockResolvedValue(mockExecutions);
    mockOrderRepo.findOne.mockResolvedValue(mockOrder);

    const result = await useCase.execute(1);
    expect(result.serviceOrder).toHaveProperty("id", 1);
    expect(result.services).toHaveLength(2);
    expect(result.services[0].serviceName).toBe("Troca de óleo");
  });

  it("deve calcular duração total quando ordem finalizada", async () => {
    const startedAt = new Date("2024-01-01T09:00:00");
    const finishedAt = new Date("2024-01-01T11:30:00");
    const mockOrder = { id: 1, status: "FINALIZADA", startedAt, finishedAt };

    mockExecutionRepo.find.mockResolvedValue([]);
    mockOrderRepo.findOne.mockResolvedValue(mockOrder);

    const result = await useCase.execute(1);
    expect(result.serviceOrder.totalDuration).toBe(150);
  });
});