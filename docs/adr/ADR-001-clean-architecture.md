# ADR-001: Adoção de Clean Architecture

**Status:** Aceito
**Data:** 2026-07 (Fase 2, mantido na Fase 3)

## Contexto

O sistema da oficina começou como uma aplicação monolítica simples na Fase 1. Com o crescimento (múltiplas unidades, mais funcionalidades), o código precisava de organização que permitisse evolução sustentável e testabilidade.

## Decisão

Adotar Clean Architecture com três camadas:

- **Domain** — entidades e regras de negócio puras (Client, Vehicle, ServiceOrder, Diagnostic, Service, Part, StockMovement, ServiceExecution, User)
- **Application** — use-cases orquestrando as regras (um use-case por operação de negócio)
- **Infrastructure** — detalhes técnicos: controllers Express, repositórios TypeORM, email, autenticação

A regra de dependência aponta sempre para dentro: Infrastructure → Application → Domain.

## Consequências

**Positivas:**
- 122 testes unitários possíveis graças ao isolamento dos use-cases
- Troca de detalhes técnicos (ex: banco local → RDS) sem tocar em regras de negócio
- Onboarding facilitado pela estrutura previsível

**Negativas:**
- Mais arquivos e indireção para operações simples (CRUD)
- Curva de aprendizado inicial
