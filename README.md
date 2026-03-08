# 🛠️ Tech Challenge - Sistema de Oficina

## 🚗 Visão Geral

Este projeto é o **MVP do back-end** de um Sistema Integrado de Atendimento e Execução de Serviços para uma oficina mecânica.  

Objetivos:  

- Gestão de ordens de serviço (OS)  
- Cadastro de clientes e veículos  
- Controle de peças e insumos  
- Orçamentos automáticos  
- Acompanhamento do status das OS em tempo real  

O sistema substitui processos manuais e planilhas, garantindo **eficiência, rastreabilidade e segurança**.

---

## ⚡ Funcionalidades Principais

### Criação de Ordem de Serviço (OS)
- Identificação do cliente por CPF/CNPJ  
- Cadastro de veículo (placa, marca, modelo, ano)  
- Inclusão de serviços solicitados (ex.: troca de óleo, alinhamento)  
- Inclusão de peças e insumos necessários  
- Orçamento gerado automaticamente  
- Envio do orçamento ao cliente para aprovação  

### Acompanhamento da OS
- Status da OS: Recebida, Em diagnóstico, Aguardando aprovação, Em execução, Finalizada, Entregue  
- Alteração automática de status conforme ações  
- Consulta via API para acompanhamento do progresso  

### Gestão Administrativa
- CRUD de clientes  
- CRUD de veículos  
- CRUD de serviços  
- CRUD de peças e insumos (controle de estoque)  
- Listagem e detalhamento de ordens de serviço  
- Monitoramento do tempo médio de execução dos serviços  

### Segurança e Qualidade
- Autenticação JWT para APIs administrativas  
- Validação de dados sensíveis (CPF/CNPJ, placa de veículo)  
- Testes unitários e de integração nos principais fluxos  

---

## 🛠️ Requisitos Técnicos
- Back-end monolítico com arquitetura em camadas (MVP)  
- Banco de dados: **PostgreSQL**  
- APIs RESTful documentadas (Swagger ou similar)  
- Dockerfile e docker-compose para orquestração do ambiente  
- Testes automatizados com cobertura mínima de 80% nos domínios críticos  

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados  
- Node.js (opcional para desenvolvimento local)  

### 1. Clonar o repositório
```bash
git clone <link-do-repositorio>
cd oficina-api