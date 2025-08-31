
# Informe del Proyecto: Liga Canelones Futsal

## 1. Resumen General

Este documento describe el estado actual de la aplicación web **Liga Canelones Futsal**. La plataforma está diseñada para ser el punto central de información para aficionados, jugadores y administradores de la liga, ofreciendo noticias, seguimiento de partidos y resultados en tiempo real.

El proyecto se enfoca en una experiencia de usuario moderna, limpia y altamente funcional, con un diseño responsivo y accesible.

## 2. Stack Tecnológico

La aplicación se está construyendo sobre un stack tecnológico moderno basado en JavaScript/TypeScript:

- **Framework Principal**: [Next.js](https://nextjs.org/) (con App Router) - Permite renderizado del lado del servidor (SSR) e híbrido, optimizando el rendimiento y el SEO.
- **Librería UI**: [React](https://react.dev/) - Para la construcción de interfaces de usuario dinámicas y componentizadas.
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) - Añade tipado estático a JavaScript, mejorando la robustez y mantenibilidad del código.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) - Un framework CSS "utility-first" para un diseño rápido y personalizable.
- **Componentes UI**: [ShadCN/UI](https://ui.shadcn.com/) - Una colección de componentes reutilizables y accesibles construidos sobre Radix UI y Tailwind CSS.
- **Inteligencia Artificial**: [Genkit (Google AI)](https://firebase.google.com/docs/genkit) - Utilizado para funcionalidades de IA, como el resumen de noticias.

## 3. Estructura Lógica del Proyecto

El código fuente está organizado de la siguiente manera para facilitar la escalabilidad y el mantenimiento:

- `src/app/`: Contiene las rutas principales de la aplicación, siguiendo la convención del App Router de Next.js.
  - `page.tsx`: Página de inicio.
  - `controles/`: Rutas relacionadas con el panel de administración.
    - `page.tsx`: Página principal del panel que lista los partidos.
    - `[id]/page.tsx`: Página dinámica para controlar un partido específico.
- `src/components/`: Alberga todos los componentes reutilizables de React.
  - `ui/`: Componentes base de ShadCN (Button, Card, Input, etc.).
  - `layout/`: Componentes estructurales como `Header` y `Footer`.
  - `controles/`: Componentes específicos para el panel de control, como `ControlMatchCard` y `MatchListSkeleton`.
  - `hero.tsx`, `news-summary.tsx`: Componentes de secciones principales de la página de inicio.
- `src/actions/`: Contiene las "Server Actions" de Next.js. Aquí reside la lógica de negocio que se ejecuta en el servidor, como la obtención de datos de partidos (`match-actions.ts`).
- `src/data/`: Archivos con datos estáticos o simulados (mock data), como la lista de equipos (`teams.ts`).
- `src/ai/`: Lógica relacionada con la Inteligencia Artificial.
  - `flows/`: Define los flujos de Genkit, como el de resumen de noticias.
- `src/lib/`: Utilidades y funciones auxiliares, como `cn` para fusionar clases de Tailwind.
- `src/hooks/`: Hooks personalizados de React, como `useToast` para notificaciones.
- `src/types/`: Definiciones de tipos de TypeScript compartidos en toda la aplicación.

## 4. Funcionalidades Implementadas

A la fecha, el proyecto cuenta con las siguientes características funcionales:

### 4.1. Página de Inicio (`/`)
- **Header y Footer**: Componentes de navegación y pie de página consistentes en todo el sitio.
- **Sección Hero**: Una sección de bienvenida visualmente atractiva con un título principal, un subtítulo y botones de llamada a la acción (CTA) que dirigen a otras secciones de la página.
- **Resumen de Noticias con IA**: Un formulario donde el usuario puede pegar la URL de un artículo de noticias y obtener un resumen generado por inteligencia artificial a través de un flujo de Genkit.
- **Secciones Placeholder**: Espacios definidos para futuras secciones de "Equipos" y "Resultados".

### 4.2. Panel de Control (`/controles`)
- **Visualización de Partidos**: Una página protegida (conceptualmente para administradores) que carga y muestra una lista de todos los partidos.
- **Filtrado por Estado**: Utiliza un sistema de pestañas (Tabs) para filtrar los partidos entre "Programados", "En Vivo" y "Finalizados".
- **Tarjetas de Partido (`ControlMatchCard`)**: Cada partido se muestra en una tarjeta individual con la información de los equipos, logos y fecha/hora.
- **Acciones Condicionales**: Las tarjetas de partido muestran diferentes botones de acción según el estado del mismo, permitiendo "Controlar" un partido programado/en vivo o ver "Estadísticas" de uno finalizado.
- **Feedback de Carga y Errores**: Muestra un esqueleto de UI (`MatchListSkeleton`) mientras se cargan los datos y notificaciones (`toast`) si ocurre un error en la carga.

### 4.3. Página de Control de Partido (`/controles/[id]`)
- **Gestión Individual**: Página dinámica que permite gestionar un partido específico.
- **Visualización del Marcador**: Muestra los nombres y logos de los equipos enfrentados y su marcador actual.
- **Control del Marcador**: Incluye controles (botones `+` y `-` e inputs numéricos) para modificar el marcador de cada equipo en tiempo real.
- **Control de Estado del Partido**: Presenta botones para "Iniciar Partido" (si está programado) o "Finalizar Partido" (si está en vivo), simulando el ciclo de vida de un encuentro.
- **Navegación**: Incluye un botón para regresar fácilmente al listado principal del panel de control.
