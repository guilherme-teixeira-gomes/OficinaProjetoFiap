# 🛠️ Tech Challenge - Sistema de Oficina

## 🚗 Visão Geral

Este projeto é o MVP do back-end de um **Sistema Integrado de Atendimento e Execução de Serviços** para uma oficina mecânica.

O sistema tem como objetivo substituir processos manuais, garantindo:

- ✅ Eficiência operacional
- ✅ Rastreabilidade das ordens de serviço
- ✅ Segurança e integridade dos dados

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

## 📦 Repositório

git clone https://github.com/guilherme-teixeira-gomes/OficinaProjetoFiap.git
cd OficinaProjetoFiap
⚙️ Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto:

env
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASS=postgres
DB_NAME=oficina

JWT_PASS=supersecret
🚀 Como Rodar o Projeto (Docker - recomendado)
🔥 Subir o ambiente

sudo docker-compose up --build
🔍 O que acontece ao rodar
API sobe na porta 3000

Banco PostgreSQL sobe na porta 5433 (host)

Banco oficina é criado automaticamente

API espera o banco iniciar (wait-port)

🌐 Acessar a API

http://localhost:3000
🗄️ Acesso ao banco (externo)
Campo	Valor
Host	localhost
Port	5433
User	postgres
Password	postgres
Database	oficina
🧪 Rodar testes

sudo docker-compose exec api npm run test
🔄 Parar o projeto

sudo docker-compose down
🧹 Resetar banco

sudo docker-compose down -v


Pré-requisitos:

Node.js 20

PostgreSQL rodando local

Rodar:


npm install
npm run build
npm run start
🐳 Estrutura Docker

Node 20

Porta: 3000

Aguarda banco subir antes de iniciar

Banco

PostgreSQL 15

Porta interna: 5432

Porta externa: 5433

📁 Estrutura do Projeto
text
src/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── entities/
 ├── routes/
 └── utils/
