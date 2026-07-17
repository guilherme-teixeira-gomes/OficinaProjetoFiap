# Modelo de Dados — Diagrama ER e Justificativa

## Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    CLIENT ||--o{ VEHICLE : possui
    CLIENT ||--o{ SERVICE_ORDER : abre
    VEHICLE ||--o{ SERVICE_ORDER : "é objeto de"
    USER ||--o{ SERVICE_ORDER : "atende (mecânico)"
    SERVICE_ORDER ||--o{ DIAGNOSTIC : contém
    DIAGNOSTIC }o--o{ SERVICE : recomenda
    DIAGNOSTIC }o--o{ PART : recomenda
    SERVICE_ORDER }o--o{ SERVICE : aprova
    SERVICE_ORDER }o--o{ PART : aprova
    SERVICE_ORDER ||--o{ SERVICE_EXECUTION : gera
    SERVICE ||--o{ SERVICE_EXECUTION : "é executado em"
    PART ||--o{ STOCK_MOVEMENT : movimenta
    SERVICE_ORDER ||--o{ STOCK_MOVEMENT : origina

    CLIENT {
        int id PK
        string name
        string document UK "CPF/CNPJ - usado na autenticacao"
        string email
        string phone
        timestamp createdAt
        timestamp deletedAt "soft delete"
    }

    VEHICLE {
        int id PK
        string plate UK
        string brand
        string model
        int year
        int clientId FK
        timestamp deletedAt "soft delete"
    }

    USER {
        int id PK
        string name
        string email UK
        string password "bcrypt hash"
        string role "admin | mecanico"
    }

    SERVICE_ORDER {
        int id PK
        int clientId FK
        int vehicleId FK
        int mechanicId FK "nullable ate aceite"
        string status "RECEBIDA..ENTREGUE"
        decimal budget
        boolean approved
        timestamp approvedAt
        timestamp startedAt
        timestamp finishedAt
        string observation
        timestamp createdAt
    }

    DIAGNOSTIC {
        int id PK
        int serviceOrderId FK
        string title
        string description
        boolean includeInBudget
        string priority "baixa | media | alta"
        string mechanicNote
        timestamp createdAt
    }

    SERVICE {
        int id PK
        string name
        string description
        decimal price
        boolean active
    }

    PART {
        int id PK
        string name
        string description
        decimal price
        int stock
        int minimumStock
        timestamp createdAt
    }

    SERVICE_EXECUTION {
        int id PK
        int serviceOrderId FK
        int serviceId FK
        string status "PENDENTE | EM_ANDAMENTO | CONCLUIDO"
        timestamp startedAt
        timestamp finishedAt
        int durationMinutes "para dashboards de tempo medio"
        string mechanicNote
    }

    STOCK_MOVEMENT {
        int id PK
        int partId FK
        int serviceOrderId FK "nullable"
        string partName "desnormalizado para auditoria"
        int quantity "negativo = saida"
        string type "IN | OUT"
        decimal unitPrice
        decimal totalValue
        string description
        string status
        timestamp createdAt
    }
```

## Justificativa da escolha do banco relacional

O domínio da oficina é **inerentemente relacional**: uma ordem de serviço conecta cliente, veículo, mecânico, diagnósticos, serviços, peças, execuções e movimentações de estoque. As garantias que sustentam o negócio são exatamente as de um RDBMS:

1. **Integridade referencial** — uma OS nunca aponta para cliente ou veículo inexistente; FKs garantem isso no banco, não só na aplicação
2. **Transações ACID** — a aprovação do orçamento atualiza a OS, baixa estoque e cria execuções atomicamente; falha em qualquer passo reverte tudo (rollback compensatório de estoque implementado no ApproveOrderUseCase)
3. **Consultas analíticas** — os dashboards de observabilidade (volume diário de OS, tempo médio por status) são agregações SQL diretas sobre `service_orders` e `service_executions`

## Justificativa dos relacionamentos

| Relacionamento | Cardinalidade | Justificativa |
|---|---|---|
| Client → Vehicle | 1:N | Um cliente pode ter vários veículos; a placa é única no sistema |
| Client → ServiceOrder | 1:N | Histórico completo de OS por cliente |
| Vehicle → ServiceOrder | 1:N | Histórico de manutenções por veículo |
| User(mecânico) → ServiceOrder | 1:N | `mechanicId` nullable — preenchido apenas no aceite, garantindo exclusividade de atendimento |
| ServiceOrder → Diagnostic | 1:N | Uma OS pode ter múltiplos diagnósticos (problemas distintos identificados) |
| Diagnostic ↔ Service/Part | N:M | Um diagnóstico recomenda vários serviços/peças; tabelas de junção geradas pelo TypeORM |
| ServiceOrder ↔ Service/Part | N:M | Itens efetivamente **aprovados** — separados das recomendações para preservar o orçamento aprovado mesmo se diagnósticos mudarem |
| ServiceOrder → ServiceExecution | 1:N | Execução individual por serviço com timestamps para métricas de produtividade |
| Part → StockMovement | 1:N | Auditoria completa de movimentações; `partName` desnormalizado preserva histórico se a peça for renomeada |

## Decisões de modelagem

- **Soft delete** (`deletedAt`) em Client e Vehicle — atende o requisito de exclusão lógica preservando histórico de OS
- **`document` (CPF) com índice único** — é a chave de autenticação da Lambda (Fase 3); consulta O(log n)
- **`durationMinutes` materializado** em ServiceExecution — evita recálculo nas consultas dos dashboards
- **Status como string constrainada** na aplicação — enum de negócio validado nos use-cases (RECEBIDA → EM_DIAGNOSTICO → AGUARDANDO_APROVACAO → EM_EXECUCAO → FINALIZADA → ENTREGUE)

## Ajustes da Fase 3

1. **Índice em `clients.document`** — acelera a autenticação por CPF da Lambda
2. **Índice composto em `service_orders (status, createdAt)`** — otimiza a listagem ordenada
3. **Índice em `service_executions (serviceId, status)`** — otimiza cálculo de tempo médio por serviço
