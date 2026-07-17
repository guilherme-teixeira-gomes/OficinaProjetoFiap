import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

/**
 * Loga cada requisição HTTP com método, rota, status e latência.
 * Alimenta as métricas de latência das APIs no New Relic.
 */
export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    const fields = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      userAgent: req.headers["user-agent"]
    };

    if (res.statusCode >= 500) {
      logger.error("http_request", fields);
    } else if (res.statusCode >= 400) {
      logger.warn("http_request", fields);
    } else {
      logger.info("http_request", fields);
    }
  });

  next();
}
