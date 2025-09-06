# Informe de Estado del Proyecto: Liga Canelones Futsal

## 1. Resumen Ejecutivo

Este documento describe el estado actual de la aplicación web **Liga Canelones Futsal**. La plataforma está diseñada para ser el punto central de información para aficionados, jugadores y administradores de la liga, ofreciendo noticias, seguimiento de partidos y, en el futuro, resultados y estadísticas en tiempo real. El proyecto se encuentra en una fase de desarrollo de frontend con una capa de datos simulada (mock data), lo que ha permitido construir y validar la interfaz de usuario de forma independiente antes de la integración con un backend.

## 2. Stack Tecnológico y Arquitectura

La aplicación se está construyendo sobre un stack tecnológico moderno basado en JavaScript/TypeScript, enfocado en el rendimiento y la experiencia de usuario.

- **Framework Principal**: **Next.js** (con App Router) - Permite renderizado del lado del servidor (SSR) e híbrido, optimizando el rendimiento y el SEO.
- **Librería UI**: **React** - Para la construcción de interfaces de usuario dinámicas y componentizadas.
- **Lenguaje**: **TypeScript** - Añade tipado estático a JavaScript, mejorando la robustez y mantenibilidad del código.
- **Estilos**: **Tailwind CSS** - Un framework CSS "utility-first" para un diseño rápido y personalizable.
- **Componentes UI**: **ShadCN/UI** - Una colección de componentes reutilizables y accesibles construidos sobre Radix UI y Tailwind CSS.
- **Inteligencia Artificial**: **Genkit (Google AI)** - Utilizado para funcionalidades de IA, como el resumen de noticias a partir de una URL.

La estructura del proyecto dentro del directorio `src/` está organizada para facilitar la escalabilidad y el mantenimiento:

- `src/app/`: Contiene las rutas principales de la aplicación, siguiendo la convención del App Router de Next.js. Aquí residen la página de inicio (`page.tsx`) y las rutas del módulo de control (`controles/`).
- `src/components/`: Alberga todos los componentes reutilizables de React. Se subdivide en `ui/` para componentes base de ShadCN, `layout/` para la estructura general (Header, Footer), y `controles/` para componentes específicos del panel de administración.
- `src/actions/`: Contiene las "Server Actions" de Next.js. Aquí reside la lógica de negocio que se ejecuta en el servidor, como la obtención de datos simulados de partidos (`match-actions.ts`).
- `src/data/`: Archivos con datos estáticos o simulados (mock data), como la lista de equipos y jugadores (`teams.ts`).
- `src/lib/`: Utilidades y funciones auxiliares, como `utils.ts` para fusionar clases de Tailwind.
- `src/types/`: Definiciones de tipos de TypeScript (`index.ts`) compartidos en toda la aplicación para garantizar la consistencia de los datos.
- `src/ai/`: Lógica relacionada con la Inteligencia Artificial, incluyendo los flujos de Genkit.

## 3. Funcionalidad Implementada - Módulos Principales

### Página Principal (`/src/app/page.tsx`)
La página de inicio sirve como el portal principal para los visitantes. Está compuesta por:
- **Header y Footer**: Componentes de navegación y pie de página consistentes en todo el sitio.
- **Hero Section**: Una sección de bienvenida visualmente atractiva con un título principal y llamadas a la acción.
- **NewsSummary**: Un componente interactivo que integra IA. Permite a los usuarios pegar la URL de un artículo de noticias y utiliza el flujo de Genkit `summarizeFutsalNews` para generar y mostrar un resumen conciso del contenido.

### Módulo de Control de Partidos (`/src/app/controles`)
Este módulo está diseñado para ser utilizado por los administradores de la liga.
- **Página de Selección (`/controles/page.tsx`):** Actúa como el centro de mando para la gestión de partidos. Presenta una lista de partidos que se pueden filtrar por su estado ("Programados", "En Vivo", "Finalizados") mediante un sistema de pestañas. Cada partido se visualiza a través de una tarjeta `ControlMatchCard`.
- **Página de Detalle (`/controles/[id]/page.tsx`):** Esta página ha sido refactorizada para ser un panel de control interactivo en tiempo real. Utiliza un `GameProvider` (React Context) para gestionar de forma centralizada todo el estado del partido. Un administrador puede seleccionar jugadores de cada equipo y registrar eventos específicos del partido (goles, faltas) a través de botones dedicados, y el marcador (`Scoreboard`) se actualiza dinámicamente. La lógica de estado es local del cliente y se inicializa con datos simulados.

## 4. Capa de Datos (Simulada)

Actualmente, la aplicación opera con una capa de datos completamente simulada para permitir un desarrollo ágil del frontend.
- El archivo `src/actions/match-actions.ts` contiene funciones que imitan llamadas a una API, pero en su lugar devuelven datos estáticos del archivo `src/data/teams.ts` con una latencia artificial para simular una carga de red.
- El archivo `src/data/teams.ts` contiene un array de objetos que define los equipos de la liga y sus respectivas plantillas de jugadores, sirviendo como la "base de datos" temporal del proyecto.

## 5. Conclusión y Próximos Pasos Sugeridos

El frontend para las funcionalidades clave de la aplicación "Liga Canelones Futsal" está construido y es funcional. Opera sobre una capa de datos simulada que permite el desarrollo y la prueba de la UI de forma aislada. La arquitectura es modular y escalable, preparada para futuras expansiones.

Los siguientes pasos lógicos sugeridos para el proyecto son:
1.  **Persistencia de Datos**: Conectar la aplicación a un backend real (como Firebase Firestore) para reemplazar los datos simulados. Esto implicaría refactorizar las `actions` para que realicen llamadas reales a la base de datos para guardar y recuperar el estado de los partidos y los eventos.
2.  **Autenticación**: Implementar un sistema de autenticación (ej. Firebase Auth) para proteger el módulo de controles y asegurar que solo los administradores autorizados puedan gestionar los partidos.
3.  **Visualización de Estadísticas**: Construir la página de estadísticas (`/partidos/[id]/estadisticas`), utilizando los datos de eventos registrados durante el partido para generar y mostrar métricas relevantes (goleadores, asistencias, etc.).
4.  **Despliegue**: Preparar la aplicación para el despliegue en una plataforma de hosting como Firebase App Hosting.
