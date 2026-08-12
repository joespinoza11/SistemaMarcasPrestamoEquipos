# Sistema de Marcas y Préstamo de Equipos

Proyecto Full Stack para el curso Tecnologías y Sist. Web II — UTN, Sede de Guanacaste.

## Estructura del proyecto

- `backend/` — API REST con Node.js + Express (ES Modules)
- `frontend/` — Interfaz con React + Vite + Bootstrap
- `database/` — docker-compose.yml e init.sql para MySQL + phpMyAdmin

## Requisitos previos

- Node.js LTS
- Docker y Docker Compose
- Git

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/joespinoza11/SistemaMarcasPrestamoEquipos.git
cd SistemaMarcasPrestamoEquipos
```

### Backend

```bash
cd backend
npm install
cp .env.example .env       # Windows PowerShell: Copy-Item .env.example .env
# completar .env con tus valores locales
npm run dev
```

El servidor queda escuchando en `http://localhost:4000` (o el puerto que se defina en `PORT` dentro de `.env`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La interfaz queda disponible en `http://localhost:5173`.

### Base de datos (Docker)

```bash
cd database
docker compose up -d
```

Esto levanta dos servicios:

- **MySQL** — host `localhost`, puerto `3306`
- **phpMyAdmin** — interfaz web en `http://localhost:8080`

## Acceso a la base de datos

**Por phpMyAdmin (interfaz web):**
- URL: `http://localhost:8080`
- Usuario: `app_user`
- Contraseña: `app_password`
- Base de datos: `marcas_equipos`

**Por conexión directa** (MySQL Workbench, DBeaver, cliente `mysql`, etc.):
- Host: `localhost` (o `127.0.0.1`)
- Puerto: `3306`
- Usuario: `app_user`
- Contraseña: `app_password`
- Base de datos: `marcas_equipos`
- Usuario root (solo para administración avanzada del contenedor): usuario `root`, contraseña `root_password`

**Usuario administrador de prueba ya cargado** en `init.sql` (para entrar al sistema desde el primer día sin registrarse):
- Usuario: `admin`
- Contraseña: `Admin123!`
- Correo: `admin@utn.ac.cr`

> Cambiar la contraseña de este usuario o eliminarlo antes de la entrega final — es solo para pruebas durante el desarrollo.

Para apagar los contenedores sin perder los datos:
```bash
docker compose stop
```

Para apagarlos y borrar también los datos guardados (la base se recrea desde cero la próxima vez):
```bash
docker compose down -v
```

### Tablas de la base de datos

Definidas en `database/init.sql`:

| Tabla | Contenido |
|---|---|
| `roles` | usuario, administrador |
| `departamentos` | departamentos/carreras de la institución |
| `usuarios` | cuentas del sistema (correo, username, password con hash) |
| `dispositivos` | dispositivos autorizados por usuario |
| `marcas` | registros de entrada/salida |
| `equipos` | inventario de equipos institucionales |
| `prestamos` | encabezado de cada préstamo |
| `prestamo_detalle` | detalle de equipos por préstamo |
| `configuracion` | parámetros del sistema (clave-valor) |
| `tokens_recuperacion` | tokens temporales de recuperación de contraseña |

## Variables de entorno (backend/.env)

Estos valores deben coincidir exactamente con los definidos en `database/docker-compose.yml`, o el backend no va a poder conectarse a MySQL.

| Variable | Descripción | Valor usado en `docker-compose.yml` |
|---|---|---|
| PORT | Puerto del servidor backend | `4000` |
| NODE_ENV | Entorno de ejecución (`development` / `production`) | `development` |
| FRONTEND_URL | URL del frontend, usada por CORS para permitir el envío de cookies | `http://localhost:5173` |
| DB_HOST | Host de la base de datos | `localhost` |
| DB_PORT | Puerto de MySQL | `3306` |
| DB_USER | Usuario de la base de datos | `app_user` |
| DB_PASSWORD | Contraseña de la base de datos | `app_password` |
| DB_NAME | Nombre de la base de datos | `marcas_equipos` |
| SESSION_SECRET | Clave secreta para firmar la sesión | (generar una propia, larga y aleatoria) |
| COOKIE_MAX_AGE | Duración de la cookie de sesión, en milisegundos | `3600000` (1 hora) |
| MAX_FILE_SIZE_MB | Tamaño máximo de archivo para imágenes de equipos | `5` |

## Flujo de trabajo (Git)

- `main`: rama protegida, solo código funcionando.
- `develop`: rama de integración.
- `feature/backend-<modulo>` y `feature/frontend-<modulo>`: una rama por módulo/persona.
