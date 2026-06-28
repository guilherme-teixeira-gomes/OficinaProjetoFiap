import { GetAverageTimeByServiceUseCase } from "../GetAverageTimeByServiceUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetAverageTimeByServiceUseCase", () => {
  let useCase: GetAverageTimeByServiceUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetAverageTimeByServiceUseCase();
  });

  it("deve calcular média de tempo", async () => {
    mockRepo.find.mockResolvedValue([
      { serviceId: 1, durationMinutes: 60 },
      { serviceId: 1, durationMinutes: 120 }
    ]);

    const result = await useCase.execute(1);
    expect(result.averageMinutes).toBe(90);
  });

  it("deve retornar média zero quando não há execuções", async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await useCase.execute(1);
    expect(result.averageMinutes).toBe(0);
  });

  it("deve ignorar execuções sem duração", async () => {
    mockRepo.find.mockResolvedValue([
      { serviceId: 1, durationMinutes: 60 }
    ]);
    const result = await useCase.execute(1);
    expect(result.totalExecutions).toBe(1);
  });
});