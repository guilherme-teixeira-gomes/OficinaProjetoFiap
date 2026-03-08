export enum OrderStatus {
    RECEBIDA = "RECEBIDA",
    EM_DIAGNOSTICO = "EM_DIAGNOSTICO",
    AGUARDANDO_APROVACAO = "AGUARDANDO_APROVACAO",
    EM_EXECUCAO = "EM_EXECUCAO",
    FINALIZADA = "FINALIZADA",
    ENTREGUE = "ENTREGUE"
  }
  
  export const validStatuses = Object.values(OrderStatus);