# Institucion App

Parte del cliente, de un sistema de gestión academica de carreras y modalidades desarrollado con Next.js y shadcn/ui.

## Requisitos Previos

- Node.js 18.x o superior
- npm, yarn, pnpm o bun

## Instalacion

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd institucion-app
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Crear un archivo `.env.local` en la raiz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_API_BASE_URL=#
```

## Ejecucion del Proyecto

### Desarrollo

```bash
npm run dev
```

El servidor de desarrollo estara disponible en [http://localhost:3000](http://localhost:3000).

### Produccion

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Configuracion de la API

| Variable | Descripcion | Valor por defecto |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_BASE_URL` | URL base de la API backend | Requerido |

La aplicacion utiliza Axios como cliente HTTP con un timeout de 30 segundos configurado por defecto.

## Tecnologias Utilizadas

### Framework Principal

- **Next.js 16.1.1** - Framework de React para produccion
- **React 19.2.3** - Biblioteca para interfaces de usuario
- **TypeScript 5** - Tipado estatico para JavaScript

### UI y Estilos

- **shadcn/ui** - Componentes de interfaz reutilizables
- **Tailwind CSS 4** - Framework de utilidades CSS
- **Radix UI** - Primitivos de UI accesibles
- **Lucide React** - Iconos

### Utilidades

- **Axios** - Cliente HTTP para peticiones a la API
- **clsx / tailwind-merge** - Utilidades para manejo de clases CSS
- **class-variance-authority** - Variantes de componentes

## Estructura del Proyecto

```
app/
  modules/          # Modulos de la aplicacion (carreras, modalidades, etc.)
  shared/           # Componentes y utilidades compartidas
    components/     # Componentes reutilizables
    core/           # Configuracion central y cliente API
    types/          # Definiciones de tipos TypeScript
public/             # Archivos estaticos
```
