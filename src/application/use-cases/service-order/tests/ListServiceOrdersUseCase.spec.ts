import { ServiceOrderRepository } from "../../../../infrastructure/repositories/ServiceOrderRepository";
import { ListServiceOrdersUseCase } from "../ListServiceOrdersUseCase";


jest.mock("../../../../infrastructure/repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    find: jest.fn(),
  }
}));

describe("ListServiceOrdersUseCase", () => {
  let listServiceOrdersUseCase: ListServiceOrdersUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    listServiceOrdersUseCase = new ListServiceOrdersUseCase();
  });

  it("deve listar ordens", async () => {
    (ServiceOrderRepository.find as jest.Mock).mockResolvedValue([
      {
        id: 1,
        services: [{ price: "100" }],
        parts: [{ price: "50" }]
      },
      {
        id: 2,
        services: [],
        parts: []
      }
    ]);

    const result = await listServiceOrdersUseCase.execute();

    expect(result.length).toBe(2);
    expect(result[0].services[0].price).toBe(100);
  });
});