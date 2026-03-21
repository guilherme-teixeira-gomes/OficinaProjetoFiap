import { ServiceOrderService } from "./ServiceOrderService";
import { ClientRepository } from "../repositories/ClientRepository";
import { VehicleRepository } from "../repositories/VehicleRepository";
import { ServiceOrderRepository } from "../repositories/ServiceOrderRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { PartRepository } from "../repositories/PartRepository";
import { DiagnosticRepository } from "../repositories/DiagnosticRepository";

// MOCK DO ServiceExecutionService
jest.mock("./ServiceExecutionService", () => ({
  ServiceExecutionService: jest.fn().mockImplementation(() => ({
    createExecutionsFromApprovedOrder: jest.fn().mockResolvedValue(undefined)
  }))
}));

jest.mock("../repositories/ClientRepository", () => ({
  ClientRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

jest.mock("../repositories/VehicleRepository", () => ({
  VehicleRepository: {
    findOne: jest.fn(),
    save: jest.fn(),
  }
}));

jest.mock("../repositories/ServiceOrderRepository", () => ({
  ServiceOrderRepository: {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  }
}));

jest.mock("../repositories/UserRepository", () => ({
  UserRepository: {
    findOne: jest.fn(),
  }
}));

jest.mock("../repositories/ServiceRepository", () => ({
  ServiceRepository: {
    findByIds: jest.fn(),
  }
}));

jest.mock("../repositories/PartRepository", () => ({
  PartRepository: {
    findByIds: jest.fn(),
  }
}));

jest.mock("../repositories/DiagnosticRepository", () => ({
  DiagnosticRepository: {
    create: jest.fn(),
    save: jest.fn(),
  }
}));

describe("ServiceOrderService - FULL", () => {
  let serviceOrderService: ServiceOrderService;

  // CPFs válidos para teste
  const VALID_CPF = "529.982.247-25"; // CPF válido
  const VALID_CPF2 = "123.456.789-09"; // Outro CPF válido
  const VALID_CNPJ = "12.345.678/0001-95"; // CNPJ válido

  beforeEach(() => {
    jest.clearAllMocks();
    serviceOrderService = new ServiceOrderService();
  });

  // =========================
  // CREATE
  // =========================

  describe("create", () => {
    it("deve criar nova ordem com cliente existente e veículo existente", async () => {
      const mockClient = {
        id: 1,
        name: "João Silva",
        document: VALID_CPF,
        email: "joao@email.com",
        phone: "11999999999",
        vehicles: []
      };

      const mockVehicle = {
        id: 1,
        plate: "ABC1234",
        brand: "Fiat",
        model: "Uno",
        year: 2020
      };

      const mockOrder = {
        id: 1,
        client: mockClient,
        vehicle: mockVehicle,
        status: "RECEBIDA",
        budget: 0
      };

      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
      (VehicleRepository.findOne as jest.Mock).mockResolvedValue(mockVehicle);
      (ServiceOrderRepository.create as jest.Mock).mockReturnValue(mockOrder);
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(mockOrder);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const result = await serviceOrderService.create({
        client: { document: VALID_CPF },
        vehicle: { id: 1 }
      });

      expect(result).toHaveProperty("id", 1);
    });

    it("deve criar novo cliente e veículo", async () => {
        const mockClient = null;
        const VALID_CPF_FOR_TEST = "529.982.247-25"; // CPF válido
        const newClient = {
          id: 1,
          name: "Maria Souza",
          document: VALID_CPF_FOR_TEST,
          email: "maria@email.com",
          phone: "11988888888"
        };
      
        const newVehicle = {
          id: 1,
          plate: "XYZ9090",
          brand: "Honda",
          model: "Civic",
          year: 2022
        };
      
        const mockOrder = {
          id: 1,
          client: newClient,
          vehicle: newVehicle,
          status: "RECEBIDA",
          budget: 0
        };
      
        (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
        (ClientRepository.save as jest.Mock).mockResolvedValue(newClient);
        (VehicleRepository.save as jest.Mock).mockResolvedValue(newVehicle);
        (ServiceOrderRepository.create as jest.Mock).mockReturnValue(mockOrder);
        (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(mockOrder);
        (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);
      
        const result = await serviceOrderService.create({
          client: {
            name: "Maria Souza",
            document: VALID_CPF_FOR_TEST,
            email: "maria@email.com",
            phone: "11988888888"
          },
          vehicle: {
            plate: "XYZ9090",
            brand: "Honda",
            model: "Civic",
            year: 2022
          }
        });
      
        expect(result).toHaveProperty("id", 1);
      });
    it("deve retornar lista de veículos quando cliente existe mas veículo não especificado", async () => {
        const mockClient = {
          id: 1,
          name: "João Silva",
          document: VALID_CPF,
          email: "joao@email.com",
          phone: "11999999999",
          vehicles: [{ id: 1, plate: "ABC1234", brand: "Fiat", model: "Uno", year: 2020 }]
        };
      
        (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
      
        const result = await serviceOrderService.create({
          client: { document: VALID_CPF },
          vehicle: {}
        });
      
        // Verificar se é o tipo de retorno com success
        if ('success' in result && result.success === true) {
          expect(result.data.vehicles.length).toBe(1);
        } else {
          fail("Expected result to have success property");
        }
      });

    it("deve lançar erro quando CPF é inválido", async () => {
      await expect(
        serviceOrderService.create({
          client: { document: "123" },
          vehicle: {}
        })
      ).rejects.toThrow("CPF ou CNPJ inválido");
    });

    it("deve lançar erro quando placa é inválida", async () => {
      const mockClient = {
        id: 1,
        document: VALID_CPF
      };
      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);

      await expect(
        serviceOrderService.create({
          client: { document: VALID_CPF },
          vehicle: { plate: "123" }
        })
      ).rejects.toThrow("Placa de veículo inválida");
    });

    it("deve criar cliente com CNPJ válido", async () => {
      const mockClient = null;
      const newClient = {
        id: 1,
        name: "Empresa LTDA",
        document: VALID_CNPJ,
        email: "empresa@email.com",
        phone: "11988888888"
      };

      const newVehicle = {
        id: 1,
        plate: "XYZ9090",
        brand: "Honda",
        model: "Civic",
        year: 2022
      };

      const mockOrder = {
        id: 1,
        client: newClient,
        vehicle: newVehicle,
        status: "RECEBIDA",
        budget: 0
      };

      (ClientRepository.findOne as jest.Mock).mockResolvedValue(mockClient);
      (ClientRepository.save as jest.Mock).mockResolvedValue(newClient);
      (VehicleRepository.save as jest.Mock).mockResolvedValue(newVehicle);
      (ServiceOrderRepository.create as jest.Mock).mockReturnValue(mockOrder);
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(mockOrder);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const result = await serviceOrderService.create({
        client: {
          name: "Empresa LTDA",
          document: VALID_CNPJ,
          email: "empresa@email.com",
          phone: "11988888888"
        },
        vehicle: {
          plate: "XYZ9090",
          brand: "Honda",
          model: "Civic",
          year: 2022
        }
      });

      expect(result).toHaveProperty("id", 1);
    });
  });

  // =========================
  // ACCEPT ORDER
  // =========================

  describe("acceptOrder", () => {
    it("deve aceitar ordem e mudar status para EM_DIAGNOSTICO", async () => {
      const mockMechanic = { id: 1, role: "mecanico" };
      const mockOrder = {
        id: 1,
        status: "RECEBIDA",
        mechanicId: null,
        mechanic: null
      };

      const updatedOrder = {
        ...mockOrder,
        status: "EM_DIAGNOSTICO",
        mechanic: mockMechanic,
        mechanicId: 1,
        startedAt: new Date()
      };

      (UserRepository.findOne as jest.Mock).mockResolvedValue(mockMechanic);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValueOnce(mockOrder);
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(updatedOrder);
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValueOnce(updatedOrder);

      const result = await serviceOrderService.acceptOrder(1, 1);

      expect(result).toHaveProperty("status", "EM_DIAGNOSTICO");
    });

    it("não deve aceitar ordem se mecânico não for encontrado", async () => {
      (UserRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(serviceOrderService.acceptOrder(1, 1)).rejects.toThrow(
        "Mecânico não encontrado ou não autorizado"
      );
    });

    it("não deve aceitar ordem já aceita", async () => {
      (UserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, role: "mecanico" });
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        status: "RECEBIDA",
        mechanicId: 2
      });

      await expect(serviceOrderService.acceptOrder(1, 1)).rejects.toThrow(
        "Esta OS já foi aceita por outro mecânico"
      );
    });

    it("não deve aceitar ordem com status diferente de RECEBIDA", async () => {
      (UserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1, role: "mecanico" });
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        status: "EM_EXECUCAO",
        mechanicId: null
      });

      await expect(serviceOrderService.acceptOrder(1, 1)).rejects.toThrow(
        "Ordem de serviço precisa estar com status RECEBIDA"
      );
    });
  });

  // =========================
  // ADD DIAGNOSTIC
  // =========================

  it("deve adicionar diagnóstico", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "EM_DIAGNOSTICO",
      diagnostics: []
    });

    (ServiceRepository.findByIds as jest.Mock).mockResolvedValue([{ id: 1, price: 100 }]);
    (PartRepository.findByIds as jest.Mock).mockResolvedValue([{ id: 2, price: 50 }]);

    (DiagnosticRepository.create as jest.Mock).mockReturnValue({ id: 99 });
    (DiagnosticRepository.save as jest.Mock).mockResolvedValue({ id: 99 });

    const result = await serviceOrderService.addDiagnostic(1, {
      title: "Teste",
      description: "desc",
      includeInBudget: true,
      priority: "alta",
      serviceIds: [1],
      partIds: [2]
    });

    expect(result).toHaveProperty("id", 99);
  });

  it("não deve adicionar diagnóstico fora do status correto", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "FINALIZADA"
    });

    await expect(
      serviceOrderService.addDiagnostic(1, {} as any)
    ).rejects.toThrow("Só é possível adicionar diagnósticos em status EM_DIAGNOSTICO");
  });

  // =========================
  // FINISH DIAGNOSTIC
  // =========================

  it("deve finalizar diagnóstico e gerar orçamento", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "EM_DIAGNOSTICO",
      diagnostics: [
        {
          id: 1,
          includeInBudget: true,
          recommendedServices: [{ price: 100 }],
          recommendedParts: [{ price: 50 }]
        }
      ]
    });

    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});

    const result = await serviceOrderService.finishDiagnostic(1);

    expect(result.status).toBe("AGUARDANDO_APROVACAO");
    expect(result.budget).toBe(150);
  });

  it("não deve finalizar diagnóstico se ordem não estiver em diagnóstico", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "FINALIZADA"
    });

    await expect(serviceOrderService.finishDiagnostic(1)).rejects.toThrow(
      "Ordem de serviço não está em diagnóstico"
    );
  });

  it("deve finalizar diagnóstico com orçamento zero quando não há itens", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "EM_DIAGNOSTICO",
      diagnostics: []
    });

    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});

    const result = await serviceOrderService.finishDiagnostic(1);

    expect(result.budget).toBe(0);
    expect(result.items).toEqual([]);
  });

  // =========================
  // APPROVE
  // =========================

  it("deve aprovar ordem e calcular orçamento", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "AGUARDANDO_APROVACAO",
      approved: false,
      diagnostics: [
        {
          id: 1,
          includeInBudget: true,
          recommendedServices: [{ id: 10, price: 100 }],
          recommendedParts: [{ id: 20, price: 50 }]
        }
      ]
    });

    (ServiceRepository.findByIds as jest.Mock).mockResolvedValue([
      { id: 10, price: 100 }
    ]);

    (PartRepository.findByIds as jest.Mock).mockResolvedValue([
      { id: 20, price: 50 }
    ]);

    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});

    const result = await serviceOrderService.approve(1);

    expect(result.budget).toBe(150);
  });

  it("deve aprovar apenas diagnósticos selecionados", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "AGUARDANDO_APROVACAO",
      approved: false,
      diagnostics: [
        {
          id: 1,
          includeInBudget: true,
          recommendedServices: [{ id: 10, price: 100 }],
          recommendedParts: []
        },
        {
          id: 2,
          includeInBudget: true,
          recommendedServices: [{ id: 20, price: 200 }],
          recommendedParts: []
        }
      ]
    });

    (ServiceRepository.findByIds as jest.Mock).mockResolvedValue([
      { id: 10, price: 100 }
    ]);

    (PartRepository.findByIds as jest.Mock).mockResolvedValue([]);
    (ServiceOrderRepository.save as jest.Mock).mockResolvedValue({});

    const result = await serviceOrderService.approve(1, [1]);

    expect(result.budget).toBe(100);
  });

  it("não deve aprovar se já aprovado", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      approved: true
    });

    await expect(serviceOrderService.approve(1)).rejects.toThrow("Orçamento já aprovado");
  });

  it("não deve aprovar se ordem não estiver aguardando aprovação", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      approved: false,
      status: "EM_EXECUCAO"
    });

    await expect(serviceOrderService.approve(1)).rejects.toThrow(
      "Ordem precisa estar aguardando aprovação"
    );
  });

  it("não deve aprovar se não houver diagnósticos", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      status: "AGUARDANDO_APROVACAO",
      approved: false,
      diagnostics: []
    });

    await expect(serviceOrderService.approve(1)).rejects.toThrow(
      "Nenhum diagnóstico encontrado para esta OS"
    );
  });

  // =========================
  // LIST
  // =========================

  it("deve listar ordens", async () => {
    (ServiceOrderRepository.find as jest.Mock).mockResolvedValue([
      {
        id: 1,
        services: [{ price: "100" }],
        parts: [{ price: "50" }]
      },
      {
        id: 2,
        services: [],
        parts: []
      }
    ]);

    const result = await serviceOrderService.list();

    expect(result.length).toBe(2);
    expect(result[0].services[0].price).toBe(100);
  });

  // =========================
  // GET BY ID
  // =========================

  it("deve buscar ordem por id", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      client: { id: 1 },
      vehicle: { id: 1 },
      services: [],
      parts: [],
      executions: []
    });

    const result = await serviceOrderService.getById(1);

    expect(result).toHaveProperty("id", 1);
  });

  it("deve retornar null se ordem não existir", async () => {
    (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(null);

    const result = await serviceOrderService.getById(999);

    expect(result).toBeNull();
  });

  // =========================
  // UPDATE STATUS
  // =========================

  describe("updateStatus", () => {
    it("deve atualizar status da ordem", async () => {
      const mockOrder = { id: 1, status: "RECEBIDA" };
      const updatedOrder = { ...mockOrder, status: "EM_DIAGNOSTICO" };

      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(updatedOrder);

      const result = await serviceOrderService.updateStatus(1, "EM_DIAGNOSTICO");

      expect(result.status).toBe("EM_DIAGNOSTICO");
    });

    it("não deve atualizar com status inválido", async () => {
      await expect(serviceOrderService.updateStatus(1, "INVALIDO")).rejects.toThrow(
        "Status inválido"
      );
    });

    it("não deve atualizar se ordem não existir", async () => {
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(serviceOrderService.updateStatus(999, "EM_DIAGNOSTICO")).rejects.toThrow(
        "Ordem de serviço não encontrada"
      );
    });
  });

  // =========================
  // FINISH
  // =========================

  describe("finish", () => {
    it("deve finalizar ordem em execução", async () => {
      const mockOrder = {
        id: 1,
        status: "EM_EXECUCAO",
        approved: true
      };
      const finishedOrder = { ...mockOrder, status: "FINALIZADA", finishedAt: new Date() };

      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(finishedOrder);

      const result = await serviceOrderService.finish(1);

      expect(result.status).toBe("FINALIZADA");
    });

    it("não deve finalizar ordem não aprovada", async () => {
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        approved: false
      });

      await expect(serviceOrderService.finish(1)).rejects.toThrow(
        "Não pode finalizar antes da aprovação"
      );
    });

    it("não deve finalizar ordem fora de execução", async () => {
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        approved: true,
        status: "RECEBIDA"
      });

      await expect(serviceOrderService.finish(1)).rejects.toThrow(
        "Ordem precisa estar em execução"
      );
    });
  });

  // =========================
  // DELIVER
  // =========================

  describe("deliver", () => {
    it("deve entregar ordem finalizada", async () => {
      const mockOrder = { id: 1, status: "FINALIZADA" };
      const deliveredOrder = { ...mockOrder, status: "ENTREGUE" };

      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue(mockOrder);
      (ServiceOrderRepository.save as jest.Mock).mockResolvedValue(deliveredOrder);

      const result = await serviceOrderService.deliver(1);

      expect(result.status).toBe("ENTREGUE");
    });

    it("não deve entregar ordem não finalizada", async () => {
      (ServiceOrderRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        status: "EM_EXECUCAO"
      });

      await expect(serviceOrderService.deliver(1)).rejects.toThrow(
        "Só é possível entregar OS finalizada"
      );
    });
  });
});