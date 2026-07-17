# Documentação Arquitetural — Tech Challenge Fase 3

Grupo MotorMind — Guilherme Teixeira Gomes (RM373517)

## Estrutura

| Pasta | Conteúdo |
|---|---|
| [adr/](adr/) | Architecture Decision Records — decisões permanentes |
| [rfc/](rfc/) | Request for Comments — decisões técnicas relevantes |
| [diagramas/](diagramas/) | Componentes, sequência e modelo ER |

## ADRs

- [ADR-001 — Clean Architecture](adr/ADR-001-clean-architecture.md)
- [ADR-002 — Horizontal Pod Autoscaler](adr/ADR-002-hpa.md)
- [ADR-003 — Comunicação síncrona REST](adr/ADR-003-comunicacao-rest.md)
- [ADR-004 — JWT stateless](adr/ADR-004-jwt-stateless.md)

## RFCs

- [RFC-001 — Escolha da nuvem (AWS)](rfc/RFC-001-escolha-da-nuvem.md)
- [RFC-002 — Escolha do banco (PostgreSQL/RDS)](rfc/RFC-002-escolha-do-banco.md)
- [RFC-003 — Estratégia de autenticação (Lambda + CPF + JWT)](rfc/RFC-003-estrategia-autenticacao.md)

## Diagramas

- [Componentes — visão de nuvem](diagramas/componentes.md)
- [Sequência — autenticação e abertura de OS](diagramas/sequencia.md)
- [Modelo ER — com justificativa dos relacionamentos](diagramas/modelo-er.md)

## Repositórios do projeto

| Repositório | Propósito |
|---|---|
| [OficinaProjetoFiap](https://github.com/guilherme-teixeira-gomes/OficinaProjetoFiap) | Aplicação principal (EKS) |
| [oficina-lambda-auth](https://github.com/guilherme-teixeira-gomes/oficina-lambda-auth) | Function serverless de autenticação |
| [oficina-infra-k8s](https://github.com/guilherme-teixeira-gomes/oficina-infra-k8s) | Terraform do cluster EKS |
| [oficina-infra-database](https://github.com/guilherme-teixeira-gomes/oficina-infra-database) | Terraform do RDS + VPC |
