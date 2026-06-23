# Libro Digital — Frontend

Aplicación web desarrollada en React + Vite que consume el BFF Service
para presentar la información del libro digital a docentes, administradores y estudiantes.

## Tecnologías

- React 18
- Vite
- React Router DOM
- Auth0 (autenticación)
- Axios (cliente HTTP)
- Bootstrap 5

## Requisitos previos

- Node.js 18 o superior
- npm instalado
- BFF Service corriendo en `http://localhost:8080`
- Los tres microservicios backend corriendo

## Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/metamistyk/libro-digital-frontend.git
cd libro-digital-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`

## Roles disponibles

| Rol | Acceso |
|-----|--------|
| `admin` | Gestión de usuarios, estudiantes, cursos, asignaturas, periodos y asignaciones |
| `docente` | Registro de asistencia, notas, anotaciones, mensajería y ranking |
| `estudiante` | Consulta de asistencias, notas, anotaciones, notificaciones y mensajería |

Los roles se asignan desde el dashboard de Auth0.

## Variables de entorno

El archivo `src/auth/auth0-config.js` contiene la configuración de Auth0.
Para un entorno propio, actualiza:

```javascript
domain: 'dev-hnxz55jjtq1inapb.us.auth0.com'
clientId: '7OGvZ3Y0AB9dPiWHsMWgnRjWTa7bs1lv'
audience: 'https://libro-digital-api'
```

## Estructura del proyecto

```
src/
├── api/          # Clientes HTTP por servicio
├── auth/         # Configuración Auth0 y rutas protegidas
├── components/   # Navbar y componentes reutilizables
└── pages/
    ├── admin/    # Páginas del rol admin
    ├── docente/  # Dashboard, ranking, mensajería
    └── usuario/  # Dashboard del estudiante
```