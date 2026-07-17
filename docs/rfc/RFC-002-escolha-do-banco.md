# RFC-002: Escolha do banco de dados gerenciado

**Status:** Aprovado
**Autor:** Guilherme Teixeira Gomes
**Data:** 2026-07

## Problema

A Fase 3 exige banco de dados gerenciado. É preciso decidir o engine e justificar formalmente a modelagem (requisito do entregável).

## Opções analisadas

### PostgreSQL (RDS)
- **Prós:** já usado nas Fases 1 e 2 (zero migração); TypeORM configurado; suporte a soft delete via `deletedAt`; tipos ricos (JSON, arrays); open source
- **Contras:** nenhum relevante ao caso

### MySQL (RDS)
- **Prós:** free tier igual; ligeiramente mais simples
- **Contras:** migração desnecessária; recursos inferiores para consultas analíticas dos dashboards

### DynamoDB
- **Prós:** serverless, escala infinita
- **Contras:** modelo do domínio é fortemente relacional (OS ↔ cliente ↔ veículo ↔ diagnósticos ↔ serviços/peças); reescrita completa da camada de dados; consultas dos dashboards de monitoramento seriam complexas

## Decisão

**PostgreSQL 15 no Amazon RDS** (db.t3.micro, free tier), mantendo o schema existente.

O domínio é inerentemente relacional: uma ordem de serviço conecta cliente, veículo, mecânico, diagnósticos, serviços, peças e execuções com integridade referencial e transações — pontos fortes de um banco relacional.

## Modelagem

Ver [diagrama ER e justificativa dos relacionamentos](../diagramas/modelo-er.md).
