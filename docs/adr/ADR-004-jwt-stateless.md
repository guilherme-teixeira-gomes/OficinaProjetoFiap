# ADR-004: Autenticação stateless com JWT

**Status:** Aceito
**Data:** 2026-07

## Contexto

Com escalabilidade horizontal (HPA de 1 a 10 réplicas), sessões em memória não funcionam — uma requisição pode cair em qualquer pod. A autenticação de clientes agora é feita por uma Lambda separada da aplicação.

## Decisão

Tokens **JWT stateless assinados com segredo compartilhado (HS256)**:

- A Lambda de autenticação assina o token após validar o CPF
- A API no EKS valida o mesmo token com o mesmo segredo (via Secret do K8s)
- Expiração: 1 hora
- Payload: clientId (sub), cpf, name, type

## Alternativas consideradas

- **Sessões com Redis:** componente extra para gerenciar, custo e complexidade
- **RS256 (chave assimétrica):** mais seguro para múltiplos emissores, mas overhead desnecessário com um único emissor confiável
- **Cognito/Auth0:** terceirização completa, porém menos didático e com lock-in

## Consequências

**Positivas:** qualquer réplica valida o token sem estado; Lambda e API desacopladas; performance (sem consulta ao banco por requisição).
**Negativas:** revogação antes da expiração não é trivial — mitigado pela expiração curta de 1h; segredo precisa ser rotacionável (K8s Secret + Lambda env).
