# RFC-001: Escolha do provedor de nuvem

**Status:** Aprovado
**Autor:** Guilherme Teixeira Gomes
**Data:** 2026-07

## Problema

A Fase 3 exige API Gateway, function serverless, banco gerenciado e cluster Kubernetes em nuvem. É necessário escolher o provedor considerando custo, aderência aos requisitos e material de estudo disponível.

## Opções analisadas

### AWS
- **Prós:** stack completa e integrada (API Gateway + Lambda + RDS + EKS); material da disciplina cobre AWS SAM e Lambda; maior mercado de trabalho; free tier cobre Lambda, API Gateway e RDS
- **Contras:** EKS cobra US$ 0,10/h pelo control plane

### Azure
- **Prós:** AKS com control plane gratuito; aula de API Management do Azure na disciplina
- **Contras:** Functions com cold start maior; menos material da disciplina sobre o restante da stack

### GCP
- **Prós:** GKE Autopilot com free tier parcial
- **Contras:** sem cobertura nas aulas; API Gateway menos maduro

## Decisão

**AWS**, pelos seguintes fatores:

1. Integração nativa API Gateway ↔ Lambda, reduzindo configuração
2. Free tier cobre 3 dos 4 componentes obrigatórios (Lambda, API Gateway, RDS)
3. Alinhamento com o material da disciplina (AWS SAM, Lambda)
4. Custo do EKS mitigado com estratégia apply/destroy via Terraform — cluster ativo somente em testes e gravação

## Estimativa de custo

| Recurso | Custo mensal estimado |
|---|---|
| Lambda | R$ 0 (free tier permanente) |
| API Gateway | R$ 0 (free tier 12 meses) |
| RDS db.t3.micro | R$ 0 (free tier 12 meses) |
| EKS + 2 nodes t3.small | ~R$ 25/dia ativo (uso pontual) |
| **Total estimado no período** | **~R$ 100-150** |
