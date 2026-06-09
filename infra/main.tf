terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

resource "docker_image" "postgres" {
  name = "postgres:15"
}

resource "docker_container" "postgres" {
  name  = "oficina-db"
  image = docker_image.postgres.image_id
  restart = "always"
  
  env = [
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=postgres",
    "POSTGRES_DB=oficina"
  ]
  
  ports {
    internal = 5432
    external = 5433
  }
}

resource "docker_image" "api" {
  name = "oficina-api:latest"
  build {
    path = ".."
  }
}

resource "docker_container" "api" {
  name  = "oficina-api"
  image = docker_image.api.image_id
  restart = "always"
  depends_on = [docker_container.postgres]
  
  ports {
    internal = 3000
    external = 3000
  }
  
  env = [
    "DB_HOST=postgres-svc",
    "DB_PORT=5432",
    "DB_USER=postgres",
    "DB_PASS=postgres",
    "DB_NAME=oficina",
    "JWT_PASS=supersecret"
  ]
}

output "api_url" {
  value = "http://localhost:3000"
}

output "api_swagger" {
  value = "http://localhost:3000/api-docs"
}