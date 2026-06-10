#!/bin/bash
# Script para criar o cluster Kind antes de rodar o Terraform
# Execute: bash setup-cluster.sh

set -e

echo "🚀 Criando cluster Kind..."
kind create cluster --name oficina --config kind-config.yaml --wait 60s

echo "✅ Cluster criado! Agora rode:"
echo "   cd infra && terraform init && terraform apply"