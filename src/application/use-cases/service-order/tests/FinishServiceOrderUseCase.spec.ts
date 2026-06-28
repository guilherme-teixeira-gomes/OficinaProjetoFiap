import { FinishServiceOrderUseCase } from "../FinishServiceOrderUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));
jest.mock("../../../../infrastructure/email/EmailService", () => ({
  sendEmail: jest.fn().mockResolvedValue({}),
  emailStatusAtualizado: jest.fn().mockReturnValue({ subject: "s", html: "h" })
}));

describe("FinishServiceOrderUseCase", () => {
  let useCase: FinishServiceOrderUseCase;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
    useCase = new FinishServiceOrderUseCase();
  });

  it("deve finalizar ordem em execução", async () => {
    const mockOrder = { id: 1, status: "EM_EXECUCAO", approved: true, client: { email: "a@a.com", name: "João" } };
    mockRepo.findOne.mockResolvedValue(mockOrder);
    mockRepo.save.mockResolvedValue({ ...mockOrder, status: "FINALIZADA" });

    const result = await useCase.execute(1);
    expect(result).toHaveProperty("status", "FINALIZADA");
  });

  it("não deve finalizar ordem não aprovada", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, status: "EM_EXECUCAO", approved: false });
    await expect(useCase.execute(1)).rejects.toThrow("Não pode finalizar antes da aprovação");
  });

  it("não deve finalizar ordem fora de execução", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, status: "RECEBIDA", approved: true });
    await expect(useCase.execute(1)).rejects.toThrow("Ordem precisa estar em execução");
  });
});