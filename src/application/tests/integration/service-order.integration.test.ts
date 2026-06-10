import request from "supertest";

const VALID_CPF            = "529.982.247-25";
const VALID_PLATE_OLD      = "TST1234";
const VALID_PLATE_MERCOSUL = "TST1A23";

let app: any;
let authToken: string;
let serviceOrderId: number;
let clientId: number;
let vehicleId: number;

beforeAll(async () => {
  jest.resetModules();

  const { AppDataSource } = await import("../../../infrastructure/database/data-source");
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const module = await import("../../..");
  app = module.app;

  await request(app).post("/user").send({
    name: "Mecânico Integração",
    email: "mecanico.integracao@test.com",
    password: "senha123",
    role: "mecanico"
  });

  const loginRes = await request(app).post("/user/login").send({
    email: "mecanico.integracao@test.com",
    password: "senha123"
  });

  authToken = loginRes.body.token;
  console.log("Token obtido:", authToken ? "✓" : "✗ FALHOU");
}, 30000);
afterAll(async () => {
  const { AppDataSource } = await import("../../../infrastructure/database/data-source");
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// ─── Abertura de OS ───────────────────────────────────────────────────────────

describe("POST /service-order — abertura de OS", () => {
  it("deve criar OS com novo cliente e veículo, retornando ID único", async () => {
    const res = await request(app)
      .post("/service-order")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        client: {
          name: "Cliente Integração",
          document: VALID_CPF,
          email: "cliente.integracao@test.com",
          phone: "11999990001"
        },
        vehicle: {
          plate: VALID_PLATE_OLD,
          brand: "Fiat",
          model: "Uno",
          year: 2020
        }
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.status).toBe("RECEBIDA");

    serviceOrderId = res.body.id;
  });

  it("deve aceitar placa no formato Mercosul", async () => {
    const res = await request(app)
      .post("/service-order")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        client: {
          name: "Cliente Mercosul",
          document: "311.533.490-95",
          email: "mercosul@test.com",
          phone: "11999990002"
        },
        vehicle: {
          plate: VALID_PLATE_MERCOSUL,
          brand: "Honda",
          model: "Civic",
          year: 2023
        }
      });

    expect(res.status).toBe(201);
  });

  it("deve retornar 400 para CPF inválido", async () => {
    const res = await request(app)
      .post("/service-order")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        client: { document: "000.000.000-00" },
        vehicle: {}
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/inválido/i);
  });
});

// ─── Consulta de status ───────────────────────────────────────────────────────

describe("GET /service-order/:id/status — consulta pública", () => {
  it("deve retornar status RECEBIDA sem autenticação", async () => {
    const res = await request(app)
      .get(`/service-order/${serviceOrderId}/status`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "RECEBIDA");
  });

  it("deve retornar 404 para OS inexistente", async () => {
    const res = await request(app).get("/service-order/999999/status");
    expect(res.status).toBe(404);
  });
});

// ─── Fluxo completo ───────────────────────────────────────────────────────────

describe("Fluxo completo da OS — todas as transições de status", () => {
  it("RECEBIDA → EM_DIAGNOSTICO via /accept", async () => {
    const res = await request(app)
      .post(`/service-order/${serviceOrderId}/accept`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ mechanicId: 1 });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("EM_DIAGNOSTICO");
  });

  it("deve adicionar diagnóstico", async () => {
    const res = await request(app)
      .post(`/service-order/${serviceOrderId}/diagnostic`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Troca de óleo",
        description: "Óleo e filtro vencidos",
        includeInBudget: true,
        priority: "alta",
        serviceIds: [],
        partIds: []
      });

    expect(res.status).toBe(201);
  });

  it("EM_DIAGNOSTICO → AGUARDANDO_APROVACAO via /finish-diagnostic (envia email)", async () => {
    const res = await request(app)
      .post(`/service-order/${serviceOrderId}/finish-diagnostic`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("AGUARDANDO_APROVACAO");
    expect(res.body).toHaveProperty("budget");
    expect(res.body).toHaveProperty("items");
  });

  it("AGUARDANDO_APROVACAO → EM_EXECUCAO via /approve (sem autenticação — link do email)", async () => {
    const res = await request(app)
      .post(`/service-order/${serviceOrderId}/approve`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("EM_EXECUCAO");
  });

  it("EM_EXECUCAO → FINALIZADA via /finish", async () => {
    const res = await request(app)
      .post(`/service-order/${serviceOrderId}/finish`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("FINALIZADA");
  });

  it("FINALIZADA → ENTREGUE via /deliver", async () => {
    const res = await request(app)
      .post(`/service-order/${serviceOrderId}/deliver`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("ENTREGUE");
  });
});

// ─── Listagem ─────────────────────────────────────────────────────────────────

describe("GET /service-order — listagem com ordenação e exclusão lógica", () => {
  it("não deve retornar OS com status FINALIZADA ou ENTREGUE por padrão", async () => {
    const res = await request(app)
      .get("/service-order")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    const statuses: string[] = res.body.map((o: any) => o.status);
    expect(statuses).not.toContain("FINALIZADA");
    expect(statuses).not.toContain("ENTREGUE");
  });

  it("deve incluir finalizadas quando excludeFinished=false", async () => {
    const res = await request(app)
      .get("/service-order?excludeFinished=false")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("deve ordenar: EM_EXECUCAO antes de AGUARDANDO_APROVACAO antes de EM_DIAGNOSTICO antes de RECEBIDA", async () => {
    const res = await request(app)
      .get("/service-order?excludeFinished=false")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const statusPriority: Record<string, number> = {
      EM_EXECUCAO:          1,
      AGUARDANDO_APROVACAO: 2,
      EM_DIAGNOSTICO:       3,
      RECEBIDA:             4,
    };

    const priorities = res.body
      .map((o: any) => statusPriority[o.status] ?? 99)
      .filter((p: number) => p !== 99);

    for (let i = 1; i < priorities.length; i++) {
      expect(priorities[i]).toBeGreaterThanOrEqual(priorities[i - 1]);
    }
  });
});

// ─── CRUD de clientes ─────────────────────────────────────────────────────────

describe("PUT /clients/:id e DELETE /clients/:id", () => {
  beforeAll(async () => {
    await request(app)
      .post("/service-order")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        client: {
          name: "Cliente CRUD Test",
          document: "098.765.432-10",
          email: "crud@test.com",
          phone: "11977776666"
        },
        vehicle: {
          plate: "CRD1234",
          brand: "VW",
          model: "Gol",
          year: 2019
        }
      });

    const res = await request(app)
      .get("/clients")
      .set("Authorization", `Bearer ${authToken}`);
    clientId = res.body[0]?.id;
  });

  it("deve atualizar telefone do cliente", async () => {
    const res = await request(app)
      .put(`/clients/${clientId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ phone: "11911110001" });

    expect(res.status).toBe(200);
    expect(res.body.data?.phone ?? res.body.phone).toBe("11911110001");
  });

  it("deve retornar erro ao atualizar cliente inexistente", async () => {
    const res = await request(app)
      .put("/clients/999999")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ phone: "11900000000" });

    expect(res.status).toBe(400);
  });

  it("deve deletar cliente (soft delete)", async () => {
    const res = await request(app)
      .delete(`/clients/${clientId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/removido/i);
  });
});

// ─── CRUD de veículos ─────────────────────────────────────────────────────────

describe("PUT /vehicles/:id e DELETE /vehicles/:id", () => {
  beforeAll(async () => {
    const res = await request(app)
      .get("/vehicles")
      .set("Authorization", `Bearer ${authToken}`);
    vehicleId = res.body[0]?.id;
  });

  it("deve atualizar ano do veículo", async () => {
    const res = await request(app)
      .put(`/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ year: 2021 });

    expect(res.status).toBe(200);
    expect(res.body.data?.year ?? res.body.year).toBe(2021);
  });

  it("deve rejeitar placa inválida na atualização", async () => {
    const res = await request(app)
      .put(`/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ plate: "INVALIDA" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/placa/i);
  });

  it("deve aceitar placa Mercosul na atualização", async () => {
    const res = await request(app)
      .put(`/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ plate: "UPD1A23" });

    expect(res.status).toBe(200);
  });

  it("deve deletar veículo (soft delete)", async () => {
    const res = await request(app)
      .delete(`/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
});