# ADR-003: Comunicação síncrona via REST/HTTP

**Status:** Aceito
**Data:** 2026-07

## Contexto

Com a segregação em Lambda (autenticação) + aplicação (EKS), era preciso definir o padrão de comunicação entre componentes e com clientes externos.

## Decisão

Manter comunicação **síncrona REST/JSON sobre HTTP** em toda a plataforma:

- Cliente → API Gateway → Lambda (autenticação)
- Cliente → API Gateway → API no EKS (operações, com JWT)
- Notificações ao cliente por email (SMTP) — único fluxo assíncrono, já existente

## Alternativas consideradas

- **Mensageria (SQS/RabbitMQ) entre serviços:** benefício pequeno no cenário atual, pois a Lambda e a API não se comunicam diretamente — compartilham apenas o banco e o segredo JWT
- **gRPC:** performance superior, mas sem necessidade no volume atual e com pior debugabilidade/documentação Swagger

## Consequências

**Positivas:** simplicidade, documentação Swagger existente, debugging fácil, compatível com API Gateway.
**Negativas:** acoplamento temporal (indisponibilidade propaga); sem retry nativo — mitigado pelo HPA e healthchecks.

## Evolução futura

Se o fluxo de notificações crescer (WhatsApp, SMS), avaliar fila SQS + Lambda de notificações.
