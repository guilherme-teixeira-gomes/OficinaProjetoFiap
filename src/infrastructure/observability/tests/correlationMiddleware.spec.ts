import { correlationMiddleware } from "../correlationMiddleware";
import { requestContext } from "../logger";

describe("correlationMiddleware", () => {
  const mockRes = () => {
    const headers: Record<string, string> = {};
    return {
      setHeader: (k: string, v: string) => { headers[k] = v; },
      getHeader: (k: string) => headers[k],
      headers
    } as any;
  };

  it("deve propagar x-correlation-id existente", (done) => {
    const req: any = { headers: { "x-correlation-id": "meu-id-123" } };
    const res = mockRes();

    correlationMiddleware(req, res, () => {
      expect(res.headers["x-correlation-id"]).toBe("meu-id-123");
      expect(requestContext.getStore()?.correlationId).toBe("meu-id-123");
      done();
    });
  });

  it("deve gerar UUID quando header ausente", (done) => {
    const req: any = { headers: {} };
    const res = mockRes();

    correlationMiddleware(req, res, () => {
      const id = requestContext.getStore()?.correlationId;
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      expect(res.headers["x-correlation-id"]).toBe(id);
      done();
    });
  });
});
