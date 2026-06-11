import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { GetServiceOrderByIdUseCase } from "../GetServiceOrderByIdUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    findOne: jest.fn(),
  }
}));

describe("GetServiceOrderByIdUseCase", () => {
  let getServiceOrderByIdUseCase: GetServiceOrderByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    getServiceOrderByIdUseCase = new GetServiceOrderByIdUseCase();
  });

  it("deve buscar ordem por id", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      client: { id: 1 },
      vehicle: { id: 1 },
      services: [],
      parts: [],
      executions: []
    });

    const result = await getServiceOrderByIdUseCase.execute(1);

    expect(result).toHaveProperty("id", 1);
  });

  it("deve retornar null se ordem não existir", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(null);

    const result = await getServiceOrderByIdUseCase.execute(999);

    expect(result).toBeNull();
  });
});