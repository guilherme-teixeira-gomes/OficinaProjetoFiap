import { UserService } from "./UserService";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../repositories/UserRepository", () => ({
  UserRepository: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("UserService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar usuário", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
    (UserRepository.create as jest.Mock).mockReturnValue({ name: "Gui" });
    (UserRepository.save as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await UserService.createUser({
      name: "Gui",
      email: "gui@email.com",
      password: "123",
      role: "admin"
    });

    expect(result).toHaveProperty("id");
  });

  it("deve dar erro se usuário já existir", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1 });

    await expect(
      UserService.createUser({
        name: "Gui",
        email: "gui@email.com",
        password: "123",
        role: "admin"
      })
    ).rejects.toThrow("Usuário já existe");
  });

  it("deve fazer login com sucesso", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      password: "hashed"
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("token");

    const result = await UserService.login("email", "123");

    expect(result).toHaveProperty("token");
  });

  it("deve falhar login com senha inválida", async () => {
    (UserRepository.findOne as jest.Mock).mockResolvedValue({
      password: "hashed"
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      UserService.login("email", "123")
    ).rejects.toThrow("Credenciais inválidas");
  });

});