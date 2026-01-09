# Sistema de Gestión Institucional - CRUD Técnico

Sistema completo de gestión académica institucional para carreras y modalidades. Aplicación full-stack desarrollada con Django REST Framework (backend) y Next.js (frontend).

---

## Tecnologías y Librerías

### Backend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Python | 3.11+ | Lenguaje de programación |
| Django | 6.0 | Framework web |
| Django REST Framework | 3.16.1 | API REST |
| SimpleJWT | 5.5.1 | Autenticación JWT |
| PostgreSQL | - | Base de datos |
| psycopg2-binary | 2.9.11 | Driver PostgreSQL |
| django-environ | 0.12.0 | Variables de entorno |
| django-cors-headers | - | Manejo de CORS |

### Frontend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Next.js | 16.1.1 | Framework React para producción |
| React | 19.2.3 | Biblioteca de UI |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 4 | Framework CSS |
| shadcn/ui | - | Componentes reutilizables |
| Axios | - | Cliente HTTP |
| Radix UI | - | Primitivos accesibles |

---

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd crud-tecnico
```

### 2. Configurar Backend

#### Crear y activar entorno virtual

**Windows:**
```bash
cd backend/institucion
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS:**
```bash
cd backend/institucion
python -m venv venv
source venv/bin/activate
```

#### Instalar dependencias

```bash
pip install -r requirements.txt
```

#### Configurar variables de entorno

Crear un archivo `.env` en `backend/institucion/` con:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True

POSTGRES_DB=institucion_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

#### Ejecutar migraciones

```bash
python manage.py migrate
```

#### Crear superusuario (opcional)

```bash
python manage.py createsuperuser
```

#### Ejecutar servidor backend

```bash
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000`

---

### 3. Configurar Frontend

#### Instalar dependencias

```bash
cd frontend/institucion-app
npm install
```

#### Configurar variables de entorno

Crear un archivo `.env.local` en `frontend/institucion-app/` con:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

#### Ejecutar servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

---

## URL Base de la API

| Entorno | URL |
|---------|-----|
| Desarrollo | `http://localhost:8000/api/` |
| Frontend | `http://localhost:3000` |

---

## Endpoints Disponibles

### Módulo Académico

#### Modalidades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/academico/modalidades` | Listar modalidades |
| POST | `/api/academico/modalidades` | Crear modalidad |
| GET | `/api/academico/modalidades/{id}` | Obtener modalidad |
| PUT | `/api/academico/modalidades/{id}` | Actualizar modalidad |
| DELETE | `/api/academico/modalidades/{id}` | Eliminar modalidad |

#### Carreras

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/academico/carreras` | Listar carreras |
| POST | `/api/academico/carreras` | Crear carrera |
| GET | `/api/academico/carreras/{id}` | Obtener carrera |
| PUT | `/api/academico/carreras/{id}` | Actualizar carrera |
| DELETE | `/api/academico/carreras/{id}` | Eliminar carrera |

---

## Credenciales

### Base de Datos

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `POSTGRES_USER` | `postgres` | Usuario por defecto |
| `POSTGRES_PASSWORD` | Configurar en `.env` | Contraseña segura |
| `POSTGRES_HOST` | `localhost` | Host de PostgreSQL |
| `POSTGRES_PORT` | `5432` | Puerto por defecto |

### Django

| Variable | Descripción |
|----------|-------------|
| `SECRET_KEY` | Clave secreta para sesiones (generar nueva) |
| `DEBUG` | `True` para desarrollo, `False` para producción |

### API

- **CORS**: Configurado para `localhost:3000` y `localhost:5173`

---

## 📁 Estructura del Proyecto

```
crud-tecnico/
├── backend/
│   └── institucion/
│       ├── apps/
│       │   ├── academico/          # Módulo académico
│       │   │   ├── forms/          # Formularios
│       │   │   ├── migrations/     # Migraciones
│       │   │   ├── serializers/    # Serializadores DRF
│       │   │   ├── views/          # Vistas/ViewSets
│       │   │   ├── models.py       # Modelos
│       │   │   └── urls.py         # Rutas
│       │   └── core/               # Módulo base
│       ├── institucion/            # Configuración Django
│       ├── manage.py
│       ├── requirements.txt
│       └── README.md
├── frontend/
│   └── institucion-app/
│       ├── app/
│       │   ├── modules/            # Módulos (carreras, modalidades)
│       │   ├── shared/             # Componentes compartidos
│       │   └── layout.tsx          # Layout principal
│       ├── public/                 # Archivos estáticos
│       ├── package.json
│       ├── next.config.ts
│       └── README.md
├── .gitignore
└── README.md
```

---

## Comandos Útiles

### Backend

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

```

### Frontend

```bash
# Instalar dependencias
npm install

# Ejecutar desarrollo
npm run dev

# Generar build para producción
npm run build

# Ejecutar servidor de producción
npm run start

# Ejecutar linter
npm run lint
```

---

## 📝 Notas Adicionales

- El proyecto utiliza **CORS** configurado para permitir peticiones desde `localhost:5173` y `localhost:3000`
- Base de datos por defecto: **PostgreSQL**
- El frontend usa **Axios** con timeout de 30 segundos
- Componentes UI desde **shadcn/ui** con **Tailwind CSS**
- API REST siguiendo estándares REST con **Django REST Framework**

---

## ⚙️ Configuración Recomendada para Producción

1. Cambiar `DEBUG=False` en el backend
2. Generar `SECRET_KEY` segura
3. Configurar variables de entorno en el servidor
4. Usar base de datos PostgreSQL en producción
5. Configurar HTTPS en el servidor
6. Implementar variables de entorno segurizadas en frontend

---

**Desarrollado:** Enero 2026
