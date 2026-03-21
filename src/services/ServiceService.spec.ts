import { ServiceService } from "./ServiceService";
import { ServiceRepository } from "../repositories/ServiceRepository";

jest.mock("../repositories/ServiceRepository", () => ({
  ServiceRepository: {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  }
}));

describe("ServiceService", () => {
  let serviceService: ServiceService;

  beforeEach(() => {
    jest.clearAllMocks();
    serviceService = new ServiceService();
  });

  describe("create", () => {
    it("deve criar serviço com sucesso", async () => {
      const mockService = { id: 1, name: "Troca de óleo", price: 100 };

      (ServiceRepository.create as jest.Mock).mockReturnValue(mockService);
      (ServiceRepository.save as jest.Mock).mockResolvedValue(mockService);

      const result = await serviceService.create({ 
        name: "Troca de óleo", 
        price: 100 
      });

      expect(result).toHaveProperty("id", 1);
      expect(result.name).toBe("Troca de óleo");
    });

    it("deve criar serviço com descrição opcional", async () => {
      const mockService = { id: 1, name: "Troca de óleo", description: "Troca de óleo do motor", price: 100 };

      (ServiceRepository.create as jest.Mock).mockReturnValue(mockService);
      (ServiceRepository.save as jest.Mock).mockResolvedValue(mockService);

      const result = await serviceService.create({ 
        name: "Troca de óleo", 
        description: "Troca de óleo do motor",
        price: 100 
      });

      expect(result.description).toBe("Troca de óleo do motor");
    });

    it("deve criar serviço com active false", async () => {
      const mockService = { id: 1, name: "Troca de óleo", price: 100, active: false };

      (ServiceRepository.create as jest.Mock).mockReturnValue(mockService);
      (ServiceRepository.save as jest.Mock).mockResolvedValue(mockService);

      const result = await serviceService.create({ 
        name: "Troca de óleo", 
        price: 100,
        active: false
      });

      expect(result.active).toBe(false);
    });
  });

  describe("list", () => {
    it("deve listar todos os serviços", async () => {
      const mockServices = [
        { id: 1, name: "Troca de óleo", price: 100 },
        { id: 2, name: "Alinhamento", price: 80 }
      ];

      (ServiceRepository.find as jest.Mock).mockResolvedValue(mockServices);

      const result = await serviceService.list();

      expect(result).toHaveLength(2);
    });

    it("deve retornar array vazio quando não há serviços", async () => {
      (ServiceRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await serviceService.list();

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("deve buscar serviço por id", async () => {
      const mockService = { id: 1, name: "Troca de óleo", price: 100 };

      (ServiceRepository.findOne as jest.Mock).mockResolvedValue(mockService);

      const result = await serviceService.getById(1);

      expect(result).toHaveProperty("id", 1);
      expect(ServiceRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("deve retornar null se serviço não existir", async () => {
      (ServiceRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await serviceService.getById(999);

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("deve atualizar serviço com sucesso", async () => {
      const existingService = { id: 1, name: "Troca de óleo", price: 100 };
      const updatedService = { ...existingService, price: 120 };

      (ServiceRepository.findOne as jest.Mock).mockResolvedValue(existingService);
      (ServiceRepository.merge as jest.Mock).mockReturnValue(updatedService);
      (ServiceRepository.save as jest.Mock).mockResolvedValue(updatedService);

      const result = await serviceService.update(1, { price: 120 });

      expect(result.price).toBe(120);
    });

    it("deve lançar erro ao atualizar serviço inexistente", async () => {
      (ServiceRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(serviceService.update(999, { price: 120 })).rejects.toThrow(
        "Serviço não encontrado"
      );
    });
  });

  describe("delete", () => {
    it("deve deletar serviço com sucesso", async () => {
      const existingService = { id: 1, name: "Troca de óleo", price: 100 };

      (ServiceRepository.findOne as jest.Mock).mockResolvedValue(existingService);
      (ServiceRepository.remove as jest.Mock).mockResolvedValue(existingService);

      await serviceService.delete(1);

      expect(ServiceRepository.remove).toHaveBeenCalledWith(existingService);
    });

    it("deve lançar erro ao deletar serviço inexistente", async () => {
      (ServiceRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(serviceService.delete(999)).rejects.toThrow("Serviço não encontrado");
    });
  });
});