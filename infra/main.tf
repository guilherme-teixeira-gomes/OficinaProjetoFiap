terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
  }
}

# ─── Provider ─────────────────────────────────────────────────────────────────
# O cluster Kind deve ser criado antes com: kind create cluster --name oficina
# Veja o script setup-cluster.sh para criar o cluster

provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = "kind-oficina"
}

# ─── Namespace ───────────────────────────────────────────────────────────────

resource "kubernetes_namespace" "oficina" {
  metadata {
    name = "oficina"
  }
}

# ─── ConfigMap ───────────────────────────────────────────────────────────────

resource "kubernetes_config_map" "oficina" {
  depends_on = [kubernetes_namespace.oficina]
  metadata {
    name      = "oficina-config"
    namespace = kubernetes_namespace.oficina.metadata[0].name
  }

  data = {
    DB_HOST  = "postgres-svc"
    DB_PORT  = "5432"
    DB_USER  = var.db_user
    DB_NAME  = var.db_name
    NODE_ENV = "production"
    APP_URL  = "http://localhost:3000"
  }
}

# ─── Secret ──────────────────────────────────────────────────────────────────

resource "kubernetes_secret" "oficina" {
  depends_on = [kubernetes_namespace.oficina]
  metadata {
    name      = "oficina-secret"
    namespace = kubernetes_namespace.oficina.metadata[0].name
  }

  data = {
    DB_PASS   = var.db_password
    JWT_PASS  = var.jwt_secret
    SMTP_USER = var.smtp_user
    SMTP_PASS = var.smtp_pass
  }
}

# ─── PersistentVolumeClaim (banco) ───────────────────────────────────────────

resource "kubernetes_persistent_volume_claim" "postgres" {
  depends_on = [kubernetes_namespace.oficina]
  metadata {
    name      = "postgres-pvc"
    namespace = kubernetes_namespace.oficina.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = { storage = "1Gi" }
    }
  }
  wait_until_bound = false
}

# ─── Deployment do PostgreSQL ─────────────────────────────────────────────────

resource "kubernetes_deployment" "postgres" {
  depends_on = [kubernetes_config_map.oficina, kubernetes_secret.oficina, kubernetes_persistent_volume_claim.postgres]
  metadata {
    name      = "postgres"
    namespace = kubernetes_namespace.oficina.metadata[0].name
  }
  spec {
    replicas = 1
    selector {
      match_labels = { app = "postgres" }
    }
    template {
      metadata { labels = { app = "postgres" } }
      spec {
        container {
          name  = "postgres"
          image = "postgres:15"
          port { container_port = 5432 }
          env {
            name = "POSTGRES_USER"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.oficina.metadata[0].name
                key  = "DB_USER"
              }
            }
          }
          env {
            name = "POSTGRES_DB"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.oficina.metadata[0].name
                key  = "DB_NAME"
              }
            }
          }
          env {
            name = "POSTGRES_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.oficina.metadata[0].name
                key  = "DB_PASS"
              }
            }
          }
          volume_mount {
            name       = "postgres-storage"
            mount_path = "/var/lib/postgresql/data"
          }
          resources {
            requests = { memory = "256Mi", cpu = "200m" }
            limits   = { memory = "512Mi", cpu = "500m" }
          }
        }
        volume {
          name = "postgres-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.postgres.metadata[0].name
          }
        }
      }
    }
  }
}

# ─── Service do PostgreSQL ────────────────────────────────────────────────────

resource "kubernetes_service" "postgres" {
  depends_on = [kubernetes_deployment.postgres]
  metadata {
    name      = "postgres-svc"
    namespace = kubernetes_namespace.oficina.metadata[0].name
  }
  spec {
    selector = { app = "postgres" }
    port {
      port        = 5432
      target_port = 5432
    }
    type = "ClusterIP"
  }
}

# ─── Deployment da API ────────────────────────────────────────────────────────

resource "kubernetes_deployment" "api" {
  depends_on = [kubernetes_service.postgres]
  metadata {
    name      = "oficina-api"
    namespace = kubernetes_namespace.oficina.metadata[0].name
  }
  spec {
    replicas = 1
    selector {
      match_labels = { app = "oficina-api" }
    }
    template {
      metadata { labels = { app = "oficina-api" } }
      spec {
        container {
          name              = "api"
          image             = "guitxgomes/oficina-api:latest"
          image_pull_policy = "Always"
          port { container_port = 3000 }

          dynamic "env" {
            for_each = {
              DB_HOST  = "DB_HOST"
              DB_PORT  = "DB_PORT"
              DB_USER  = "DB_USER"
              DB_NAME  = "DB_NAME"
              NODE_ENV = "NODE_ENV"
              APP_URL  = "APP_URL"
            }
            content {
              name = env.key
              value_from {
                config_map_key_ref {
                  name = kubernetes_config_map.oficina.metadata[0].name
                  key  = env.value
                }
              }
            }
          }

          dynamic "env" {
            for_each = {
              DB_PASS   = "DB_PASS"
              JWT_PASS  = "JWT_PASS"
              SMTP_USER = "SMTP_USER"
              SMTP_PASS = "SMTP_PASS"
            }
            content {
              name = env.key
              value_from {
                secret_key_ref {
                  name = kubernetes_secret.oficina.metadata[0].name
                  key  = env.value
                }
              }
            }
          }

          env {
            name  = "SMTP_HOST"
            value = "smtp.ethereal.email"
          }
          env {
            name  = "SMTP_PORT"
            value = "587"
          }

          resources {
            requests = { memory = "256Mi", cpu = "200m" }
            limits   = { memory = "512Mi", cpu = "500m" }
          }

          readiness_probe {
            http_get {
              path = "/api-docs"
              port = 3000
            }
            initial_delay_seconds = 40
            period_seconds        = 10
            failure_threshold     = 10
          }

          liveness_probe {
            http_get {
              path = "/api-docs"
              port = 3000
            }
            initial_delay_seconds = 60
            period_seconds        = 15
            failure_threshold     = 5
          }
        }
      }
    }
  }

  timeouts {
    create = "5m"
    update = "5m"
  }
}

# ─── Service da API ───────────────────────────────────────────────────────────

resource "kubernetes_service" "api" {
  depends_on = [kubernetes_deployment.api]
  metadata {
    name      = "oficina-svc"
    namespace = kubernetes_namespace.oficina.metadata[0].name
  }
  spec {
    selector = { app = "oficina-api" }
    port {
      port        = 80
      target_port = 3000
      node_port   = 30080
    }
    type = "NodePort"
  }
}

# ─── HPA ─────────────────────────────────────────────────────────────────────

resource "kubernetes_horizontal_pod_autoscaler_v2" "api" {
  depends_on = [kubernetes_deployment.api]
  metadata {
    name      = "oficina-api-hpa"
    namespace = kubernetes_namespace.oficina.metadata[0].name
  }
  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.api.metadata[0].name
    }
    min_replicas = 1
    max_replicas = 10
    metric {
      type = "Resource"
      resource {
        name = "cpu"
        target {
          type                = "Utilization"
          average_utilization = 50
        }
      }
    }
    metric {
      type = "Resource"
      resource {
        name = "memory"
        target {
          type                = "Utilization"
          average_utilization = 80
        }
      }
    }
  }
}

# ─── Outputs ─────────────────────────────────────────────────────────────────

output "api_url" {
  value       = "http://localhost:3000"
  description = "URL da API (via NodePort mapeado no cluster Kind)"
}

output "api_swagger" {
  value       = "http://localhost:3000/api-docs"
  description = "Swagger da API"
}