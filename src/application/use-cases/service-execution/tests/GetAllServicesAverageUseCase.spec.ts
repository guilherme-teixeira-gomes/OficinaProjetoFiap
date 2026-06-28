import { GetAllServicesAverageUseCase } from "../GetAllServicesAverageUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("GetAllServicesAverageUseCase", () => {
  let useCase: GetAllServicesAverageUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { find: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new GetAllServicesAverageUseCase();
  });

  it("deve calcular média de todos os serviços", async () => {
    mockRepo.find.mockResolvedValue([
      { serviceId: 1, durationMinutes: 60, service: { name: "Troca de óleo" } },
      { serviceId: 1, durationMinutes: 120, service: { name: "Troca de óleo" } }
    ]);

    const result = await useCase.execute();
    expect(result).toHaveLength(1);
    expect(result[0].averageMinutes).toBe(90);
  });

  it("deve retornar array vazio quando não há execuções", async () => {
    mockRepo.find.mockResolvedValue([]);
    const result = await useCase.execute();
    expect(result).toHaveLength(0);
  });

  it("deve lidar com serviços sem nome", async () => {
    mockRepo.find.mockResolvedValue([
      { serviceId: 1, durationMinutes: 60, service: null }
    ]);
    const result = await useCase.execute();
    expect(result[0].serviceName).toBeUndefined();
  });
});