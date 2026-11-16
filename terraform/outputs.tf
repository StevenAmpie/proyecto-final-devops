output "alb_dns_name" {
  description = "URL publica del Application Load Balancer para acceder a la aplicacion"
  value       = "http://${aws_lb.main.dns_name}"
}

output "ecr_frontend_repository_url" {
  description = "URL del repositorio ECR para el Frontend"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecr_backend_repository_url" {
  description = "URL del repositorio ECR para el Backend"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecs_cluster_name" {
  description = "Nombre del Cluster ECS"
  value       = aws_ecs_cluster.main.name
}

output "ecs_frontend_service_name" {
  description = "Nombre del Servicio ECS Frontend"
  value       = aws_ecs_service.frontend.name
}

output "ecs_backend_service_name" {
  description = "Nombre del Servicio ECS Backend"
  value       = aws_ecs_service.backend.name
}
