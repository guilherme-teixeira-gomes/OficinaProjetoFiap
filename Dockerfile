# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && \
    mkdir -p dist/infrastructure/web/swagger && \
    cp src/infrastructure/web/swagger/swagger.json dist/infrastructure/web/swagger/

# Remove devDependencies para o stage final
RUN npm prune --production

# ─── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Usuário não-root por segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copia apenas o necessário do stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/newrelic.js ./

# Ajusta permissões
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "-r", "newrelic", "dist/index.js"]