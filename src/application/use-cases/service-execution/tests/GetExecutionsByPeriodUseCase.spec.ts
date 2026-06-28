import { GetExecutionsByPeriodUseCase } from "../GetExecutionsByPeriodUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetExecutionsByPeriodUseCase", () => {
  let useCase: GetExecutionsByPeriodUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetExecutionsByPeriodUseCase();
  });

  it("deve retornar execuções no período", async () => {
    mockRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await useCase.execute(new Date("2024-01-01"), new Date("2024-12-31"));
    expect(result).toHaveLength(2);
  });
});