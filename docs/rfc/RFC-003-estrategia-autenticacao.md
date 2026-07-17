# RFC-003: Estratégia de autenticação por CPF

**Status:** Aprovado
**Autor:** Guilherme Teixeira Gomes
**Data:** 2026-07

## Problema

A Fase 3 exige autenticação de clientes via CPF por meio de function serverless, protegendo rotas sensíveis atrás de um API Gateway.

## Requisitos

1. Validar o CPF do cliente (formato e dígitos verificadores)
2. Consultar existência e status do cliente na base
3. Gerar e devolver JWT válido para as APIs protegidas

## Opções analisadas

### Lambda própria + JWT (escolhida)
- Function Node.js/TypeScript valida CPF, consulta o RDS e assina JWT (HS256, 1h)
- **Prós:** controle total do fluxo; mesmo stack da aplicação; free tier; didático
- **Contras:** manutenção própria do código de auth

### Amazon Cognito
- **Prós:** gerenciado, MFA pronto
- **Contras:** fluxo por CPF (sem senha) exigiria custom auth flow com Lambdas triggers — mais complexo que a Lambda direta; custo após free tier

### Auth0/Clerk
- **Contras:** dependência externa, custo, e o requisito pede explicitamente uma function serverless própria

## Decisão

**Lambda própria** (`oficina-lambda-auth`) atrás do **AWS API Gateway**:

```
POST /auth { cpf } → Lambda → valida CPF → consulta RDS → JWT (1h)
```

Rotas protegidas na API validam o mesmo JWT (segredo compartilhado via Secrets).

## Segurança

- CPF validado com dígitos verificadores antes de tocar o banco
- Cliente inativo (soft-deleted) recebe 403
- Token com expiração curta (1h)
- Segredo JWT em AWS Secrets/K8s Secret, nunca em código
