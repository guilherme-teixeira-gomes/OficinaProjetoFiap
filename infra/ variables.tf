variable "db_user" {
  description = "Usuário do banco de dados"
  type        = string
  default     = "postgres"
}

variable "db_name" {
  description = "Nome do banco de dados"
  type        = string
  default     = "oficina"
}

variable "db_password" {
  description = "Senha do banco de dados"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Chave secreta para JWT"
  type        = string
  sensitive   = true
}

variable "smtp_user" {
  description = "Usuário SMTP para envio de emails"
  type        = string
  sensitive   = true
}

variable "smtp_pass" {
  description = "Senha SMTP para envio de emails"
  type        = string
  sensitive   = true
}