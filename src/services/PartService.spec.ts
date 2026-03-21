import { PartService } from "./PartService";
import { PartRepository } from "../repositories/PartRepository";

jest.mock("../repositories/PartRepository", () => ({
  PartRepository: {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  }
}));

describe("PartService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar peça", async () => {
    (PartRepository.create as jest.Mock).mockReturnValue({
      name: "Filtro de óleo",
      price: 50
    });

    (PartRepository.save as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Filtro de óleo",
      price: 50
    });

    const service = new PartService();

    const result = await service.create({
      name: "Filtro de óleo",
      price: 50
    });

    expect(result).toHaveProperty("id");
    expect(result.name).toBe("Filtro de óleo");
  });

  it("deve listar peças", async () => {
    (PartRepository.find as jest.Mock).mockResolvedValue([
      { id: 1, name: "Filtro", price: 50 }
    ]);

    const service = new PartService();

    const result = await service.list();

    expect(result.length).toBe(1);
  });

  it("deve buscar peça por id", async () => {
    (PartRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Filtro"
    });

    const service = new PartService();

    const result = await service.getById(1);

    expect(result).toHaveProperty("id");
  });

  it("deve atualizar peça", async () => {
    const mockPart = { id: 1, name: "Filtro antigo" };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(mockPart);
    (PartRepository.save as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Filtro novo"
    });

    const service = new PartService();

    const result = await service.update(1, { name: "Filtro novo" });

    expect(PartRepository.merge).toHaveBeenCalled();
    expect(result.name).toBe("Filtro novo");
  });

  it("deve dar erro ao atualizar peça inexistente", async () => {
    (PartRepository.findOne as jest.Mock).mockResolvedValue(null);

    const service = new PartService();

    await expect(
      service.update(1, { name: "Teste" })
    ).rejects.toThrow("Peça não encontrada");
  });

  it("deve deletar peça", async () => {
    const mockPart = { id: 1 };

    (PartRepository.findOne as jest.Mock).mockResolvedValue(mockPart);
    (PartRepository.remove as jest.Mock).mockResolvedValue(mockPart);

    const service = new PartService();

    const result = await service.delete(1);

    expect(result).toHaveProperty("id");
  });

  it("deve dar erro ao deletar peça inexistente", async () => {
    (PartRepository.findOne as jest.Mock).mockResolvedValue(null);

    const service = new PartService();

    await expect(service.delete(1)).rejects.toThrow("Peça não encontrada");
  });

});