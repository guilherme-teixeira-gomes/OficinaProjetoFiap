import bcrypt from "bcrypt";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { UserRepository } from "../../../../infrastructure/repositories/UserRepository";

jest.mock("../../../../infrastructure/repositories/UserRepository", () => ({
  UserRepository: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }
}));

jest.mock("bcrypt");

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar usuário com sucesso", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
    (UserRepository.create as jest.Mock).mockReturnValue({ id: 1, name: "Gui", email: "gui@email.com", role: "admin" });
    (UserRepository.save as jest.Mock).mockResolvedValue({ id: 1, name: "Gui", email: "gui@email.com", role: "admin" });

    // Chamada ESTÁTICA - não usa new
    const result = await CreateUserUseCase.createUser({
      name: "Gui",
      email: "gui@email.com",
      password: "123",
      role: "admin"
    });

    expect(result).toHaveProperty("id");
    expect(bcrypt.hash).toHaveBeenCalledWith("123", 10);
  });

  it("deve dar erro se usuário já existir", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, email: "gui@email.com" });

    await expect(
      CreateUserUseCase.createUser({
        name: "Gui",
        email: "gui@email.com",
        password: "123",
        role: "admin"
      })
    ).rejects.toThrow("Usuário já existe");
  });
});