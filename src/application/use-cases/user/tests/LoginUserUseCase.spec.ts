import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginUserUseCase } from "../LoginUserUseCase";
import { UserRepository } from "../../../../infrastructure/repositories/UserRepository";

jest.mock("../../../../infrastructure/repositories/UserRepository", () => ({
  UserRepository: {
    findOne: jest.fn(),
  }
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("LoginUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve fazer login com sucesso", async () => {
    const mockUser = {
      id: 1,
      name: "Gui",
      email: "gui@email.com",
      password: "hashed",
      role: "admin"
    };

    (UserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token123");

    // Chamada ESTÁTICA - não usa new
    const result = await LoginUserUseCase.login("gui@email.com", "123");

    expect(result).toHaveProperty("token");
    expect(result.user).toHaveProperty("id", 1);
    expect(result.user).not.toHaveProperty("password");
  });

  it("deve falhar login se usuário não existir", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      LoginUserUseCase.login("naoexiste@email.com", "123")
    ).rejects.toThrow("Credenciais inválidas");
  });

  it("deve falhar login com senha inválida", async () => {
    const mockUser = {
      id: 1,
      email: "gui@email.com",
      password: "hashed"
    };

    (UserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      LoginUserUseCase.login("gui@email.com", "senhaerrada")
    ).rejects.toThrow("Credenciais inválidas");
  });
});