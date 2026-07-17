import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import { requestContext } from "./logger";

/**
 * Middleware de correlação entre requisições.
 *
 * - Aceita um x-correlation-id vindo do cliente/API Gateway (propagação entre serviços)
 * - Gera um UUID novo quando ausente
 * - Devolve o ID no header da resposta para rastreio ponta a ponta
 * - Disponibiliza o ID para todos os logs da cadeia via AsyncLocalStorage
 */
export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = (req.headers["x-correlation-id"] as string) || randomUUID();

  res.setHeader("x-correlation-id", correlationId);

  requestContext.run({ correlationId }, () => next());
}
