# Sistema de Gestión Institucional - Backend API

Backend desarrollado con Django y Django Rest Framework para la gestión académica institucional.

---

## 📋 Tecnologías y Librerías

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

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd institucion
```

### 2. Crear y activar entorno virtual

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS:**
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
SECRET_KEY=#
DEBUG=#


POSTGRES_DB=#
POSTGRES_USER=#
POSTGRES_PASSWORD=#
POSTGRES_HOST=#
POSTGRES_PORT=#
```

### 5. Ejecutar migraciones

```bash
python manage.py migrate
```

### 6. Ejecutar el servidor

```bash
python manage.py runserver
```

---

## URL Base de la API

| Entorno | URL |
|---------|-----|
| Desarrollo | `http://localhost:8000/api/` |

---

## Endpoints Disponibles

### Módulo Académico

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/academico/modalidades` | Listar modalidades |
| POST | `/api/academico/modalidades` | Crear modalidad |
| GET | `/api/academico/modalidades/{id}` | Obtener modalidad |
| PUT | `/api/academico/modalidades/{id}` | Actualizar modalidad |
| DELETE | `/api/academico/modalidades/{id}` | Eliminar modalidad |
| GET | `/api/academico/carreras` | Listar carreras |
| POST | `/api/academico/carreras` | Crear carrera |
| GET | `/api/academico/carreras/{id}` | Obtener carrera |
| PUT | `/api/academico/carreras/{id}` | Actualizar carrera |
| DELETE | `/api/academico/carreras/{id}` | Eliminar carrera |


## Estructura del Proyecto

```
institucion/
├── apps/
│   ├── academico/          # Módulo académico (carreras, modalidades)
│   │   ├── forms/          # Formularios
│   │   ├── migrations/     # Migraciones de BD
│   │   ├── serializers/    # Serializadores DRF
│   │   ├── views/          # Vistas/ViewSets
│   │   ├── models.py       # Modelos de datos
│   │   └── urls.py         # Rutas del módulo
│   └── core/               # Módulo base (abstracciones)
├── institucion/            # Configuración del proyecto
│   ├── settings.py         # Configuración Django
│   ├── urls.py             # Rutas principales
│   └── wsgi.py             # Configuración WSGI
├── manage.py
├── requirements.txt
└── README.md
```

---

##  Notas Adicionales

- El proyecto utiliza **CORS** configurado para permitir peticiones desde `localhost:5173` y `localhost:3000`
- Base de datos por defecto: **PostgreSQL**
