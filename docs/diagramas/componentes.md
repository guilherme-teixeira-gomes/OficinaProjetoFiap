# Diagrama de Componentes — Visão de Nuvem

```mermaid
graph TB
    subgraph Clientes
        WEB[Cliente Web/Mobile]
        MEC[Mecânico/Admin]
    end

    subgraph AWS["AWS us-east-1"]
        subgraph Gateway["API Gateway"]
            GW[AWS API Gateway<br/>roteamento + throttling]
        end

        subgraph Serverless
            LAMBDA[Lambda oficina-auth<br/>Node.js 20<br/>validação CPF + JWT]
        end

        subgraph VPC["VPC 10.0.0.0/16"]
            subgraph EKS["Cluster EKS oficina-eks"]
                API[Deployment oficina-api<br/>Node.js + Express<br/>Clean Architecture]
                HPA[HPA 1-10 réplicas<br/>CPU 50% / Mem 80%]
                SVC[Service NodePort/LB]
            end

            RDS[(RDS PostgreSQL 15<br/>db.t3.micro<br/>subnets privadas)]
        end

        SECRETS[Secrets<br/>JWT + DB credentials]
    end

    subgraph Observabilidade["New Relic"]
        APM[APM - latência das APIs]
        LOGS[Logs estruturados JSON<br/>correlation ID]
        DASH[Dashboards<br/>volume OS/dia<br/>tempo médio por status<br/>erros]
        ALERTS[Alertas<br/>falhas no processamento de OS]
    end

    subgraph CICD["GitHub - 4 repositórios"]
        R1[oficina-lambda-auth<br/>CI/CD → Lambda]
        R2[oficina-infra-database<br/>CI/CD → Terraform RDS]
        R3[oficina-infra-k8s<br/>CI/CD → Terraform EKS]
        R4[OficinaProjetoFiap<br/>CI/CD → Docker Hub → EKS]
    end

    WEB -->|"POST /auth (CPF)"| GW
    WEB -->|"APIs públicas (status OS, aprovar)"| GW
    MEC -->|"APIs protegidas (JWT)"| GW
    GW --> LAMBDA
    GW --> SVC
    SVC --> API
    LAMBDA -->|consulta cliente| RDS
    API -->|TypeORM| RDS
    LAMBDA -.->|lê segredo| SECRETS
    API -.->|lê segredo| SECRETS
    HPA -.->|escala| API
    API ==>|agente APM + logs| APM
    API ==> LOGS
    LOGS --> DASH
    APM --> ALERTS
    R1 -.->|deploy| LAMBDA
    R2 -.->|apply| RDS
    R3 -.->|apply| EKS
    R4 -.->|deploy| API
```

## Componentes

| Componente | Responsabilidade | Repositório |
|---|---|---|
| API Gateway | Porta de entrada única; roteia /auth para a Lambda e demais rotas para o EKS; throttling | oficina-infra-k8s (config) |
| Lambda oficina-auth | Autenticação por CPF: valida, consulta base, emite JWT | oficina-lambda-auth |
| EKS oficina-api | Regras de negócio: OS, clientes, veículos, estoque, execuções | OficinaProjetoFiap |
| RDS PostgreSQL | Persistência relacional gerenciada | oficina-infra-database |
| New Relic | APM, logs estruturados, dashboards e alertas | agente na aplicação |
