variable "aws_region" {
  description = "Region de AWS donde se desplegara la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre base para etiquetar y nombrar los recursos"
  type        = string
  default     = "devops-task-app"
}

variable "environment" {
  description = "Ambiente de despliegue"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "Bloque CIDR de la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "frontend_image_tag" {
  description = "Etiqueta inicial de la imagen Docker del frontend"
  type        = string
  default     = "latest"
}

variable "backend_image_tag" {
  description = "Etiqueta inicial de la imagen Docker del backend"
  type        = string
  default     = "latest"
}
