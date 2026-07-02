# 🛠️ Tech Challenge — Sistema de Oficina Mecânica

## Fase 2: Qualidade, Resiliência e Escalabilidade

Sistema back-end para gestão de ordens de serviço de oficina mecânica, evoluído para suportar infraestrutura escalável com Kubernetes, automação de deploy via CI/CD e provisionamento com Terraform.

---

## Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────┐
│                     CI/CD (GitHub Actions)               │
│  push → testes → docker build → deploy Kubernetes       │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               Kubernetes Cluster (Kind local)            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  HPA (1–10 réplicas, CPU 50% / Memória 80%)      │   │
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
| IaC | Terraform | Provisionamento do cluster e recursos K8s |
| CI/CD | GitHub Actions | Build, testes e deploy automatizados |

---

## Fluxo de Status da OS

```
RECEBIDA → (aceitar) → EM_DIAGNOSTICO → (finalizar diagnóstico) →
AGUARDANDO_APROVACAO → (cliente aprova) → EM_EXECUCAO →
(finalizar) → FINALIZADA → (entregar) → ENTREGUE
```

---

## Execução Local

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20 (opcional, para rodar sem Docker)

### Subir com Docker Compose

```bash
# 1. Clone o repositório e acesse a branch da Fase 2
git clone https://github.com/guilherme-teixeira-gomes/OficinaProjetoFiap.git
cd OficinaProjetoFiap
git checkout fasetwo

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus valores

# 3. Suba os containers
docker compose up -d

# 4. Acesse a API
# http://localhost:3000
# Swagger: http://localhost:3000/api-docs
```

### Rodar testes

```bash
npm install
npm test
```

---

## Deploy em Kubernetes

### Pré-requisitos

- kubectl instalado
- Kind instalado (`sudo snap install kubectl --classic`)
- Docker instalado e rodando

### Passo a passo

```bash
# 1. Crie o cluster Kind
kind create cluster --name oficina

# 2. Crie o Secret com as credenciais
kubectl create secret generic oficina-secret \
  --from-literal=DB_PASS="sua_senha_postgres" \
  --from-literal=JWT_PASS="seu_jwt_secret" \
  --from-literal=SMTP_USER="seu@email.com" \
  --from-literal=SMTP_PASS="sua_senha_smtp"

# 3. Aplique os manifestos
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl rollout status deployment/postgres
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml

# 4. Verifique os pods
kubectl get pods
kubectl get hpa

# 5. Acesse a API
# http://localhost:3000
# http://localhost:3000/api-docs
```

### Verificar escalabilidade (HPA)

```bash
# Acompanhar o HPA
kubectl get hpa oficina-api-hpa --watch
```

---

## Provisionamento com Terraform

### Pré-requisitos

- Terraform >= 1.7 instalado
- Docker instalado e rodando
- Kind instalado

### Passo a passo

```bash
# 1. Crie o cluster Kind usando o script
bash infra/setup-cluster.sh

# 2. Entre na pasta infra
cd infra

# 3. Copie e preencha as variáveis
cp terraform.tfvars.example terraform.tfvars
# Edite terraform.tfvars com suas credenciais

# 4. Inicialize os providers
terraform init

# 5. Visualize o que será criado
terraform plan

# 6. Aplique (cria todos os recursos K8s)
terraform apply

# 7. Para destruir tudo
terraform destroy
kind delete cluster --name oficina
```

### Recursos criados pelo Terraform

| Recurso | Descrição |
|---|---|
| `kubernetes_namespace` | Namespace `oficina` isolado para o projeto |
| `kubernetes_config_map` | Variáveis de ambiente não-sensíveis |
| `kubernetes_secret` | Credenciais sensíveis (banco, JWT, SMTP) |
| `kubernetes_persistent_volume_claim` | Volume de 1Gi para o banco |
| `kubernetes_deployment` (postgres) | Pod do PostgreSQL 15 |
| `kubernetes_service` (postgres) | ClusterIP interno para o banco |
| `kubernetes_deployment` (api) | 1 réplica da API (escalada pelo HPA) |
| `kubernetes_service` (api) | NodePort 30080 → 3000 |
| `kubernetes_horizontal_pod_autoscaler_v2` | HPA 1–10 réplicas |

---

## CI/CD Pipeline (GitHub Actions)

### Fluxo

```
push para main ou fasetwo
    │
    ├── [Testes e Build] npm ci → testes unitários → build TypeScript
    │
    ├── [Build e Push Docker] build + push com tags :latest e :sha
    │
    └── [Deploy Kubernetes] Kind no runner → apply manifestos → rollout
```

### Secrets necessários no GitHub

| Secret | Descrição |
|---|---|
| `DOCKER_USERNAME` | Usuário do Docker Hub |
| `DOCKER_PASSWORD` | Token do Docker Hub |
| `DB_PASS` | Senha do banco |
| `JWT_PASS` | Chave JWT |
| `SMTP_USER` | Usuário SMTP |
| `SMTP_PASS` | Senha SMTP |

---

## APIs

- **Swagger interativo:** http://localhost:3000/api-docs
- **Collection Postman:** SUBSTITUIR_LINK_POSTMAN

### Endpoints principais

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| POST | `/user` | — | Cadastrar usuário |
| POST | `/user/login` | — | Login (retorna JWT) |
| POST | `/service-order` | ✓ | Abrir nova OS |
| GET | `/service-order` | ✓ | Listar OS (ordenadas por status) |
| GET | `/service-order/:id/status` | — | Consultar status da OS |
| POST | `/service-order/:id/accept` | ✓ | Aceitar OS (mecânico) |
| POST | `/service-order/:id/diagnostic` | ✓ | Adicionar diagnóstico |
| POST | `/service-order/:id/finish-diagnostic` | ✓ | Finalizar diagnóstico (envia email) |
| POST | `/service-order/:id/approve` | — | Aprovar orçamento (cliente via email) |
| POST | `/service-order/:id/finish` | ✓ | Finalizar execução |
| POST | `/service-order/:id/deliver` | ✓ | Registrar entrega |
| GET | `/clients` | ✓ | Listar clientes |
| PUT | `/clients/:id` | ✓ | Atualizar cliente |
| DELETE | `/clients/:id` | ✓ | Remover cliente (soft delete) |
| GET | `/vehicles` | ✓ | Listar veículos |
| PUT | `/vehicles/:id` | ✓ | Atualizar veículo |
| DELETE | `/vehicles/:id` | ✓ | Remover veículo (soft delete) |

---

## Testes

```bash
# Todos os testes
npm test

# Só unitários
npx jest --testPathPatterns=spec

# Só integração (requer banco rodando)
npx jest --testPathPatterns=integration
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
- Jest (testes unitários e integração)
- Docker + Docker Compose
- Kubernetes (Kind)
- Terraform >= 1.7
- GitHub Actions
