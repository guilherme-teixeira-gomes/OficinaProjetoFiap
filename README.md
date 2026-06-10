# 🛠️ Tech Challenge — Sistema de Oficina Mecânica

## Fase 2: Qualidade, Resiliência e Escalabilidade

Sistema back-end para gestão de ordens de serviço de oficina mecânica, evoluído para suportar infraestrutura escalável com Kubernetes, automação de deploy via CI/CD e provisionamento com Terraform.

---

## Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────┐
│                     CI/CD (GitHub Actions)               │
│  push → test → sonar → docker build → kubectl deploy    │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               Kubernetes Cluster (Kind local)            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  HPA (2–10 réplicas, CPU 50% / Memória 80%)      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  │   │
│  │  │ API Pod 1  │  │ API Pod 2  │  │ API Pod N  │  │   │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  │   │
│  │        └───────────────┼───────────────┘         │   │
│  │                   oficina-svc                     │   │
│  │                (NodePort :30080)                  │   │
│  └───────────────────────┬──────────────────────────┘   │
│                          │                               │
│  ┌───────────────────────▼──────────────────────────┐   │
│  │  PostgreSQL Pod — postgres-svc (ClusterIP :5432) │   │
│  │  PersistentVolumeClaim 1Gi                        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      │
              SMTP Ethereal (email)
```

### Componentes

| Componente | Tecnologia | Descrição |
|---|---|---|
| API | Node.js 20 + TypeScript + Express | Back-end REST com Clean Architecture |
| Banco | PostgreSQL 15 | Persistência das OS, clientes, veículos e peças |
| Autenticação | JWT | Rotas protegidas por token |
| Email | Nodemailer + SMTP | Notificações de status ao cliente |
| Containerização | Docker + Docker Compose | Ambiente de desenvolvimento |
| Orquestração | Kubernetes (Kind) | Produção com auto-scaling |
| IaC | Terraform | Provisionamento do cluster e recursos |
| CI/CD | GitHub Actions | Build, testes, análise e deploy automatizados |
| Qualidade | SonarQube | Análise estática do código |

---

## Fluxo de Status da OS

```
RECEBIDA → (aceitar) → DIAGNOSTICO → (finalizar diagnóstico) →
AGUARDANDO_APROVACAO → (cliente aprova) → EXECUCAO →
(finalizar) → FINALIZADA → (entregar) → ENTREGUE
```

---

## Execução Local

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20 (opcional, para rodar sem Docker)

### Subir com Docker Compose

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/oficina-api.git
cd oficina-api

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus valores

# 3. Suba os containers
docker compose up -d

# 4. Execute as migrations
docker compose exec api npm run migration:run

# 5. Acesse a API
curl http://localhost:3000
# Swagger: http://localhost:3000/api-docs
```

### Rodar localmente sem Docker

```bash
npm install
npm run migration:run
npm run dev
```

---

## Deploy em Kubernetes

### Pré-requisitos

- kubectl instalado
- Cluster Kubernetes acessível (Kind, Minikube ou cloud)
- Imagem Docker disponível (local ou registry)

### Passo a passo

```bash
# 1. Crie o Secret com as credenciais reais
kubectl create secret generic oficina-secret \
  --from-literal=DB_PASS="sua_senha_postgres" \
  --from-literal=JWT_PASS="seu_jwt_secret" \
  --from-literal=SMTP_USER="seu@email.com" \
  --from-literal=SMTP_PASS="sua_senha_smtp"

# 2. Aplique os manifestos em ordem
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml

# 3. Aguarde o banco estar pronto
kubectl rollout status deployment/postgres

# 4. Aplique a API
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/api-service.yaml
kubectl apply -f k8s/hpa.yaml

# 5. Verifique os pods
kubectl get pods
kubectl get hpa

# 6. Acesse a API (Kind/Minikube)
# http://localhost:30080
# http://localhost:30080/api-docs
```

### Verificar escalabilidade (HPA)

```bash
# Simular carga (em outro terminal)
kubectl run -i --tty load-generator --rm --image=busybox \
  --restart=Never -- sh -c "while true; do \
  wget -q -O- http://oficina-svc/service-order; done"

# Acompanhar o HPA escalando
kubectl get hpa oficina-api-hpa --watch
```

---

## Provisionamento com Terraform

### Pré-requisitos

- Terraform >= 1.5 instalado
- Docker instalado e rodando
- Kind instalado (`brew install kind` ou https://kind.sigs.k8s.io)
- Imagem `oficina-api:latest` buildada localmente

### Passo a passo

```bash
cd infra

# 1. Copie e preencha as variáveis
cp terraform.tfvars.example terraform.tfvars
# Edite terraform.tfvars com suas credenciais reais

# 2. Inicialize os providers
terraform init

# 3. Visualize o que será criado
terraform plan

# 4. Aplique (cria cluster Kind + todos os recursos K8s)
terraform apply

# 5. Para destruir tudo
terraform destroy
```

### Recursos criados pelo Terraform

| Recurso | Descrição |
|---|---|
| `kind_cluster.oficina` | Cluster Kubernetes local com 1 control-plane e 1 worker |
| `kubernetes_namespace.oficina` | Namespace isolado para o projeto |
| `kubernetes_config_map.oficina` | Variáveis de ambiente não-sensíveis |
| `kubernetes_secret.oficina` | Credenciais sensíveis (banco, JWT, SMTP) |
| `kubernetes_persistent_volume_claim.postgres` | Volume de 1Gi para o banco |
| `kubernetes_deployment.postgres` | Pod do PostgreSQL 15 |
| `kubernetes_service.postgres` | ClusterIP interno para o banco |
| `kubernetes_deployment.api` | 2 réplicas da API |
| `kubernetes_service.api` | NodePort 30080 → 3000 |
| `kubernetes_horizontal_pod_autoscaler_v2.api` | HPA 2–10 réplicas |

---

## CI/CD Pipeline (GitHub Actions)

### Fluxo

```
push/PR para main
    │
    ├── [test] npm ci → npm test → npm run build
    │
    ├── [sonarqube] análise estática (apenas push)
    │
    ├── [docker-build] build + push com tags :latest e :sha (apenas push)
    │
    └── [deploy] kubectl apply nos manifestos K8s (apenas push na main)
```

### Secrets necessários no GitHub

| Secret | Descrição |
|---|---|
| `DOCKER_USERNAME` | Usuário do Docker Hub |
| `DOCKER_PASSWORD` | Senha/token do Docker Hub |
| `SONAR_TOKEN` | Token do SonarQube |
| `KUBECONFIG` | kubeconfig em base64 (`base64 ~/.kube/config`) |
| `DB_PASS` | Senha do banco |
| `JWT_PASS` | Chave JWT |
| `SMTP_USER` | Usuário SMTP |
| `SMTP_PASS` | Senha SMTP |

---

## APIs

- **Swagger interativo:** http://localhost:3000/api-docs
- **Collection Postman:** [link da collection](SUBSTITUIR_LINK_POSTMAN)

### Endpoints principais

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| POST | `/service-order` | ✓ | Abrir nova OS |
| GET | `/service-order` | ✓ | Listar OS (ordenadas por status) |
| GET | `/service-order/:id` | — | Consultar OS |
| GET | `/service-order/:id/status` | — | Consultar status da OS |
| POST | `/service-order/:id/accept` | ✓ | Aceitar OS (mecânico) |
| POST | `/service-order/:id/diagnostic` | ✓ | Adicionar diagnóstico |
| POST | `/service-order/:id/finish-diagnostic` | ✓ | Finalizar diagnóstico (envia email) |
| POST | `/service-order/:id/approve` | — | Aprovar orçamento (cliente) |
| POST | `/service-order/:id/reject` | — | Recusar orçamento (cliente) |
| POST | `/service-order/:id/finish` | ✓ | Finalizar execução |
| POST | `/service-order/:id/deliver` | ✓ | Registrar entrega |

---

## Testes

```bash
# Rodar testes
npm test

# Com cobertura
npm run test:coverage
```

---

## Vídeo Demonstrativo

[Assistir no YouTube](SUBSTITUIR_LINK_VIDEO) — até 15 minutos demonstrando:
- Deploy da aplicação
- Execução do pipeline CI/CD
- Consumo das APIs via Swagger
- Escalabilidade automática com HPA

---

## Tecnologias

- Node.js 20 + TypeScript 5
- Express + TypeORM + PostgreSQL 15
- Jest (testes unitários)
- Docker + Docker Compose
- Kubernetes (Kind)
- Terraform >= 1.5
- GitHub Actions
- SonarQube