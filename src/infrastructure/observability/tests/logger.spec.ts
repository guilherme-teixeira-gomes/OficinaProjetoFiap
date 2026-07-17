import { logger, requestContext } from "../logger";


describe("logger estruturado", () => {
  let output: string[];
  let spy: jest.SpyInstance;

  beforeEach(() => {
    output = [];
    spy = jest.spyOn(console, "log").mockImplementation((msg: string) => { output.push(msg); });
  });

  afterEach(() => spy.mockRestore());

  it("deve emitir JSON válido com campos padrão", () => {
    logger.info("teste", { extra: 123 });
    const entry = JSON.parse(output[0]);
    expect(entry.level).toBe("info");
    expect(entry.message).toBe("teste");
    expect(entry.extra).toBe(123);
    expect(entry.service).toBe("oficina-api");
    expect(entry.timestamp).toBeDefined();
  });

  it("deve incluir correlationId quando dentro do contexto", () => {
    requestContext.run({ correlationId: "abc-123" }, () => {
      logger.info("com contexto");
    });
    const entry = JSON.parse(output[0]);
    expect(entry.correlationId).toBe("abc-123");
  });

  it("deve emitir correlationId null fora do contexto", () => {
    logger.warn("sem contexto");
    const entry = JSON.parse(output[0]);
    expect(entry.correlationId).toBeNull();
  });
});
