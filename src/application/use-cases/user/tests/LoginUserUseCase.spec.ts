import { LoginUserUseCase } from "../LoginUserUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));
jest.mock("bcrypt", () => ({ compare: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn().mockReturnValue("token123") }));

describe("LoginUserUseCase", () => {
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  it("deve fazer login com sucesso", async () => {
    const bcrypt = require("bcrypt");
    mockRepo.findOne.mockResolvedValue({ id: 1, email: "gui@test.com", password: "hashed", role: "mecanico", name: "Gui" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await LoginUserUseCase.login("gui@test.com", "senha123");
    expect(result).toHaveProperty("token");
  });

  it("deve falhar login se usuário não existir", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(LoginUserUseCase.login("nao@existe.com", "123")).rejects.toThrow("Credenciais inválidas");
  });

  it("deve falhar login com senha inválida", async () => {
    const bcrypt = require("bcrypt");
    mockRepo.findOne.mockResolvedValue({ id: 1, email: "gui@test.com", password: "hashed" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(LoginUserUseCase.login("gui@test.com", "errada")).rejects.toThrow("Credenciais inválidas");
  });
});