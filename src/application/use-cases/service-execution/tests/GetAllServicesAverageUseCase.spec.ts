import { ServiceExecutionRepository } from "../../../../infrastructure/repositories/ServiceExecutionRepository";
import { GetAllServicesAverageUseCase } from "../GetAllServicesAverageUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceExecutionRepository", () => ({
  ServiceExecutionRepository: {
    find: jest.fn(),
  }
}));

describe("GetAllServicesAverageUseCase", () => {
  let getAllServicesAverageUseCase: GetAllServicesAverageUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getAllServicesAverageUseCase = new GetAllServicesAverageUseCase();
  });

  describe("execute", () => {
    it("deve calcular média de todos os serviços", async () => {
      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([
        { serviceId: 1, durationMinutes: 60, service: { id: 1, name: "Troca de óleo" } },
        { serviceId: 1, durationMinutes: 30, service: { id: 1, name: "Troca de óleo" } },
        { serviceId: 2, durationMinutes: 90, service: { id: 2, name: "Alinhamento" } }
      ]);

      const result = await getAllServicesAverageUseCase.execute();

      expect(result).toHaveLength(2);
      expect(result[0].averageMinutes).toBe(45);
      expect(result[1].averageMinutes).toBe(90);
    });

    it("deve retornar array vazio quando não há execuções", async () => {
      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await getAllServicesAverageUseCase.execute();

      expect(result).toEqual([]);
    });

    it("deve lidar com serviços sem nome", async () => {
      (ServiceExecutionRepository.find as jest.Mock).mockResolvedValue([
        { serviceId: 1, durationMinutes: 60, service: null },
        { serviceId: 1, durationMinutes: 30, service: null }
      ]);

      const result = await getAllServicesAverageUseCase.execute();

      expect(result).toHaveLength(1);
      expect(result[0].serviceName).toBeUndefined();
      expect(result[0].averageMinutes).toBe(45);
    });
  });
});