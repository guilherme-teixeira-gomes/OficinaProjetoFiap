# 🛠️ Tech Challenge - Sistema de Oficina

## 🚗 Visão Geral

Este projeto é o MVP do back-end de um **Sistema Integrado de Atendimento e Execução de Serviços** para uma oficina mecânica.

O sistema tem como objetivo substituir processos manuais, garantindo:

- ✅ Eficiência operacional
- ✅ Rastreabilidade das ordens de serviço
- ✅ Segurança e integridade dos dados

## 📋 Requisitos Atendidos - Fase 2

### ✅ Evolução da Aplicação

| Requisito | Status | Implementação |
|-----------|--------|----------------|
| Clean Code | ✅ | Código refatorado com nomes claros e coesão |
| Clean Architecture/Hexagonal | ✅ | Camadas separadas (use-cases, domain, infrastructure) |
| Testes automatizados | ✅ | Unitários para todos os use-cases críticos |

### ✅ Novas APIs

| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/service-order` | POST | Abertura de OS com serviços e peças | ✅ |
| `/service-order/:id/status` | GET | Consulta de status da OS | ✅ |
| `/service-order/:id/approve` | POST | Aprovação de orçamento | ✅ |
| `/service-order/:id/reject` | POST | Recusa de orçamento | ✅ |
| `/service-order` | GET | Listagem com ordenação e exclusão | ✅ |

## ⚡ Funcionalidades

### 📌 Ordem de Serviço (OS)

- Cadastro de cliente (CPF/CNPJ)
- Cadastro de veículo
- Inclusão de serviços e peças
- Geração automática de orçamento
- Envio para aprovação

### 🔄 Acompanhamento

Status da OS:

- Recebida
- Em diagnóstico
- Aguardando aprovação
- Em execução
- Finalizada
- Entregue

### 🧩 Gestão

- CRUD de clientes
- CRUD de veículos
- CRUD de serviços
- CRUD de peças e estoque
- Listagem e detalhamento de OS

### 🔐 Segurança

- Autenticação com JWT
- Validação de dados
- Testes automatizados

## 🛠️ Tecnologias

- Node.js 20
- TypeScript
- PostgreSQL
- Docker + Docker Compose
- Kubernetes (Kind/Minikube)
- GitHub Actions (CI/CD)
- Terraform (IaC)

## 🏗️ Arquitetura da Solução

```mermaid
graph TB
    subgraph "Cliente"
        A[Cliente/Postman] --> B[API Gateway / Load Balancer]
    end

    subgraph "Kubernetes Cluster"
        B --> C[Service API - NodePort]
        C --> D1[Pod: API - Réplica 1]
        C --> D2[Pod: API - Réplica 2]
        C --> D3[Pod: API - Réplica N]
        
        D1 --> E[Service PostgreSQL]
        D2 --> E
        D3 --> E
        
        E --> F[Pod: PostgreSQL]
        F --> G[Persistent Volume]
        
        H[Horizontal Pod Autoscaler] -.-> D1
        H -.-> D2
        H -.-> D3
    end

    subgraph "Recursos Externos"
        D1 -.-> I[SMTP - Ethereal]
        D2 -.-> I
        D3 -.-> I
    end

    subgraph "CI/CD Pipeline"
        J[GitHub] --> K[GitHub Actions]
        K --> L[Docker Build]
        L --> M[Docker Registry]
        M --> D1
        M --> D2
        M --> D3
    end