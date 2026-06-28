import { CreateUserUseCase } from "../CreateUserUseCase";
import { AppDataSource } from "../../../../infrastructure/database/data-source";

jest.mock("../../../../infrastructure/database/data-source", () => ({
  AppDataSource: { getRepository: jest.fn() }
}));
jest.mock("bcrypt", () => ({ hash: jest.fn().mockResolvedValue("hashed") }));

describe("CreateUserUseCase", () => {
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  it("deve criar usuário com sucesso", async () => {
    mockRepo.findOne.mockResolvedValue(null);
    const mockUser = { id: 1, name: "Gui", email: "gui@test.com", role: "mecanico" };
    mockRepo.create.mockReturnValue(mockUser);
    mockRepo.save.mockResolvedValue(mockUser);

    const result = await CreateUserUseCase.createUser({ name: "Gui", email: "gui@test.com", password: "123", role: "mecanico" });
    expect(result).toHaveProperty("id", 1);
  });

  it("deve dar erro se usuário já existir", async () => {
    mockRepo.findOne.mockResolvedValue({ id: 1, email: "gui@test.com" });
    await expect(CreateUserUseCase.createUser({ name: "Gui", email: "gui@test.com", password: "123", role: "mecanico" }))
      .rejects.toThrow("Usuário já existe");
  });
});