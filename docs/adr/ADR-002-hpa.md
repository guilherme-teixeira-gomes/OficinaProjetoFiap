# ADR-002: Escalabilidade com Horizontal Pod Autoscaler

**Status:** Aceito
**Data:** 2026-07 (Fase 2, mantido na Fase 3)

## Contexto

A oficina tem picos de demanda em horários específicos (abertura, pós-almoço) e precisa suportar grandes volumes de ordens de serviço sem desperdiçar recursos em horários ociosos.

## Decisão

Usar Horizontal Pod Autoscaler (HPA) do Kubernetes para escalar a API automaticamente:

- Mínimo: 1 réplica | Máximo: 10 réplicas
- Gatilhos: CPU > 50% ou memória > 80%
- Na Fase 3, o node group do EKS também escala (1-3 nodes), criando duas camadas de elasticidade

## Alternativas consideradas

- **Escala vertical (aumentar recursos do pod):** limitada pelo tamanho do node e exige restart
- **Réplicas fixas altas:** desperdício de custo em horários ociosos
- **KEDA (event-driven):** complexidade desnecessária para o padrão de tráfego HTTP atual

## Consequências

**Positivas:** custo proporcional à demanda; resiliência a picos; zero intervenção manual.
**Negativas:** cold start de novos pods (~30s); exige requests/limits bem calibrados; metrics-server obrigatório.
