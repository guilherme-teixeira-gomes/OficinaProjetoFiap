import { DeliverServiceOrderUseCase } from "../DeliverServiceOrderUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));
jest.mock("../../../../infrastructure/email/EmailService", () => ({
  sendEmail: jest.fn().mockResolvedValue({}),
  emailStatusAtualizado: jest.fn().mockReturnValue({ subject: "s", html: "h" })
}));

describe("DeliverServiceOrderUseCase", () => {
  let useCase: DeliverServiceOrderUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new DeliverServiceOrderUseCase();
  });

  it("deve entregar ordem finalizada", async () => {
    const mockOrder = { id: 1, status: "FINALIZADA", client: { email: "a@a.com", name: "João" } };
    mockRepo.findOne.mockResolvedValue(mockOrder);
    mockRepo.save.mockResolvedValue({ ...mockOrder, status: "ENTREGUE" });

    const result = await useCase.execute(1);
    expect(result).toHaveProperty("status", "ENTREGUE");
  });

  it("não deve entregar ordem não finalizada", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, status: "EM_EXECUCAO" });
    await expect(useCase.execute(1)).rejects.toThrow("Só é possível entregar OS finalizada");
  });
});