import { CreateExecutionsFromApprovedOrderUseCase } from "../CreateExecutionsFromApprovedOrderUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));

describe("CreateExecutionsFromApprovedOrderUseCase", () => {
  let useCase: CreateExecutionsFromApprovedOrderUseCase;
  let mockOrderRepo: any;
  let mockExecutionRepo: any;

  beforeEach(() => {
    mockOrderRepo = { findOne: jest.fn() };
    mockExecutionRepo = { findOne: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock)
      .mockImplementationOnce(() => mockOrderRepo)
      .mockImplementationOnce(() => mockExecutionRepo);
    useCase = new CreateExecutionsFromApprovedOrderUseCase();
  });

  it("deve criar execuções a partir da ordem aprovada", async () => {
    const mockOrder = { id: 1, services: [{ id: 1 }, { id: 2 }] };
    mockOrderRepo.findOne.mockResolvedValue(mockOrder);
    mockExecutionRepo.findOne.mockResolvedValue(null);
    mockExecutionRepo.save.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce({ id: 2 });

    const result = await useCase.execute(1);
    expect(result).toHaveLength(2);
  });

  it("não deve criar execuções duplicadas", async () => {
    const mockOrder = { id: 1, services: [{ id: 1 }] };
    mockOrderRepo.findOne.mockResolvedValue(mockOrder);
    mockExecutionRepo.findOne.mockResolvedValue({ id: 1, serviceOrderId: 1, serviceId: 1 });

    const result = await useCase.execute(1);
    expect(result).toHaveLength(0);
  });
});