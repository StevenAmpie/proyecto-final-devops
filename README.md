# Proyecto Final: Tres Pipelines DevOps en AWS

Implementacion completa de un flujo DevOps automatizado utilizando Terraform, Docker, Amazon ECR, Amazon ECS (Fargate) y GitHub Actions para desplegar una aplicacion web de gestion de tareas (Frontend y Backend).

## Arquitectura de la Solucion

La infraestructura desplegada en la region `us-east-1` de AWS consta de los siguientes componentes:

1. **Red (VPC):** Una Virtual Private Cloud (`10.0.0.0/16`) con dos subredes publicas en distintas Zonas de Disponibilidad para alta disponibilidad, conectadas a Internet mediante un Internet Gateway.
2. **Enrutamiento y Balanceo (Application Load Balancer):** Punto unico de entrada publico en el puerto 80.
   - Las peticiones a `/` se enrutan al Target Group del Frontend (puerto 80).
   - Las peticiones a `/api/*` se enrutan al Target Group del Backend (puerto 3000).
3. **Seguridad (Security Groups):**
   - `alb-sg`: Permite trafico HTTP (puerto 80) desde Internet.
   - `ecs-tasks-sg`: Bloquea el acceso directo desde Internet a los contenedores; unicamente acepta trafico proveniente del `alb-sg`.
4. **Registro de Contenedores (Amazon ECR):** Dos repositorios privados (`devops-task-app-frontend` y `devops-task-app-backend`) con escaneo de vulnerabilidades activado.
5. **Computo Serverless (Amazon ECS Fargate):** Un cluster ECS ejecutando dos servicios independientes sin administracion de servidores EC2, con monitoreo centralizado en Amazon CloudWatch Logs.

## Estructura del Repositorio

```text
proyecto-final-devops/
├── .github/workflows/          # Workflows activos ejecutados por GitHub Actions
│   ├── 01-infraestructura.yml
│   ├── 02-build-push.yml
│   └── 03-deploy-ecs.yml
├── pipelines/                  # Copia de respaldo de las definiciones de pipelines para entrega
│   ├── 01-infraestructura.yml
│   ├── 02-build-push.yml
│   └── 03-deploy-ecs.yml
├── terraform/                  # Infraestructura como Codigo (IaC)
│   ├── alb.tf
│   ├── ecr.tf
│   ├── ecs.tf
│   ├── network.tf
│   ├── outputs.tf
│   ├── providers.tf
│   ├── security.tf
│   ├── terraform.tfvars.example
│   └── variables.tf
├── aplicacion/                 # Codigo fuente de la aplicacion web
│   ├── backend/                # API REST en Node.js y Express
│   └── frontend/               # Interfaz web servida con Nginx
└── README.md
```

## Requisitos Previos

1. Cuenta de AWS estandar con un usuario IAM que tenga permisos para administrar VPC, EC2/ALB, ECR, ECS, IAM y CloudWatch Logs.
2. Repositorio en GitHub donde se alojara este codigo.
3. Configuracion de secretos en el repositorio de GitHub (`Settings > Secrets and variables > Actions`):
   - `AWS_ACCESS_KEY_ID`: Clave de acceso del usuario IAM.
   - `AWS_SECRET_ACCESS_KEY`: Clave secreta del usuario IAM.

## Pasos para Reproducir la Solucion

### Paso 1: Ejecutar Pipeline 1 (Infraestructura)
1. Dirigirse a la pestana **Actions** en GitHub.
2. Seleccionar **Pipeline 1 - Infraestructura como Codigo (Terraform)**.
3. Hacer clic en **Run workflow**, verificar que la opcion `apply` este seleccionada y ejecutar.
4. Esperar a que Terraform cree la VPC, el ALB, los repositorios ECR y el cluster ECS.
   - *Nota:* En este primer despliegue, las tareas de ECS intentaran iniciar buscando la etiqueta `latest` en ECR, la cual aun no existe hasta ejecutar el Pipeline 2.

### Paso 2: Ejecutar Pipeline 2 (Construccion y Publicacion en ECR)
1. Seleccionar **Pipeline 2 - Construccion y Publicacion en Amazon ECR**.
2. Hacer clic en **Run workflow** (o realizar un `push` en la carpeta `aplicacion/`).
3. El pipeline construira ambas imagenes Docker, las etiquetara con el SHA del commit y con `latest`, y las subira a sus respectivos repositorios en Amazon ECR.

### Paso 3: Ejecutar Pipeline 3 (Despliegue en ECS)
1. Al finalizar exitosamente el Pipeline 2, el **Pipeline 3 - Despliegue Continuo en Amazon ECS** se disparara automaticamente (tambien puede ejecutarse de forma manual mediante **Run workflow**).
2. Este pipeline descarga las Task Definitions actuales, inyecta la URI de las nuevas imagenes publicadas en ECR, actualiza ambos servicios en ECS y espera a que los contenedores pasen los Health Checks del Application Load Balancer.
3. Al finalizar, el ultimo paso del pipeline imprimira la URL publica del ALB (`http://devops-task-app-alb-XXXX.us-east-1.elb.amazonaws.com`) y validara que tanto `/` como `/api/health` respondan con codigo HTTP 200.

## Limpieza de Recursos (Evitar Cargos en AWS)

Para eliminar toda la infraestructura al finalizar la demostracion:
1. Ir a **Actions > Pipeline 1 - Infraestructura como Codigo (Terraform)**.
2. Ejecutar **Run workflow** seleccionando la opcion `destroy` en el menu desplegable.
