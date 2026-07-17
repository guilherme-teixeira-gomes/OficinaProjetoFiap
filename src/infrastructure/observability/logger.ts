import { AsyncLocalStorage } from "async_hooks";

/**
 * Armazena o correlationId da requisição atual ao longo de toda a cadeia async,
 * permitindo que qualquer log emitido durante o processamento carregue o mesmo ID.
 */
export const requestContext = new AsyncLocalStorage<{ correlationId: string }>();

type Level = "info" | "warn" | "error";

interface LogFields {
  [key: string]: unknown;
}

function emit(level: Level, message: string, fields: LogFields = {}) {
  const correlationId = requestContext.getStore()?.correlationId;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    correlationId: correlationId ?? null,
    service: "oficina-api",
    ...fields
  };

  // Log estruturado em JSON — consumido pelo New Relic via stdout
  console.log(JSON.stringify(entry));
}

export const logger = {
  info: (message: string, fields?: LogFields) => emit("info", message, fields),
  warn: (message: string, fields?: LogFields) => emit("warn", message, fields),
  error: (message: string, fields?: LogFields) => emit("error", message, fields)
};
