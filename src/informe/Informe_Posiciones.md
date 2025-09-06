# Informe de Módulo: Página de Clasificación y Estadísticas (`/posiciones`)

## 1. Resumen Ejecutivo

Este documento detalla la arquitectura y funcionalidad de la página de **Clasificación y Estadísticas**, ubicada en `src/app/posiciones/page.tsx`. Esta sección es un centro de datos crucial para la aplicación, diseñada para ofrecer a los usuarios una visión completa del estado de la competición. Integra tres vistas clave en una sola interfaz mediante un sistema de pestañas: la **Tabla de Posiciones** de los equipos, el **Calendario** completo de partidos y un **Ranking de Jugadores** destacados.

## 2. Arquitectura y Stack Tecnológico

La página está construida como un **Componente de Cliente** (`'use client'`) para permitir la interactividad del sistema de pestañas y la carga de datos de forma dinámica para cada vista.

-   **Framework**: Next.js (App Router)
-   **Librería UI**: React (con hooks `useState` y `useEffect` para la gestión de estado y ciclo de vida).
-   **Componentes UI**: ShadCN/UI, específicamente `Tabs` para la navegación principal, `Table` para la clasificación, y `Carousel` para el filtro de jornadas en el calendario.
-   **Acciones de Servidor**: Utiliza `server actions` como `getStandingsFromMatches`, `getAllMatches`, y `getAggregatedPlayerStats` para obtener los datos desde la capa de servidor de forma asíncrona.

## 3. Flujo de Datos y Lógica Principal

1.  **Carga Dinámica por Pestaña**: La página utiliza un `useEffect` que se dispara cada vez que el usuario cambia de pestaña (`activeTab`). Esto optimiza la carga de datos, ya que solo se solicita la información necesaria para la vista activa, en lugar de cargar todos los datos de las tres pestañas a la vez.
2.  **Estado Local**: Mantiene tres piezas de estado local (`standings`, `players`, `matches`) para almacenar los datos de cada pestaña. Inicialmente, estos estados son `null` para permitir la visualización de un esqueleto de carga (`TabSkeleton`) y mejorar la experiencia de usuario percibida.
3.  **Componentes Reutilizados y Especializados**: La página actúa como un orquestador, renderizando componentes especializados y reutilizados para cada pestaña, lo que mantiene el código limpio y modular.

## 4. Desglose de Componentes y Vistas

### 4.1. Pestaña de Clasificación

-   **Componente Principal**: `StandingsTable` (`src/components/posiciones/StandingsTable.tsx`).
-   **Funcionalidad**:
    -   Muestra la tabla de posiciones de los equipos de la liga.
    -   Las columnas incluyen información clave como Puntos (Pts), Partidos Jugados (PJ), Victorias (G), Empates (E), Derrotas (P), y diferencia de goles (GF, GC, DG).
    -   **Feedback Visual**: Incluye indicadores visuales como flechas de tendencia (arriba, abajo, igual) y un resumen de los últimos 5 resultados (`W`, `D`, `L`) para ofrecer una visión rápida del estado de forma de cada equipo.
    -   **Interactividad**: El nombre de cada equipo es un enlace que dirige a la página de detalle del club (`/clubes/[slug]`).

### 4.2. Pestaña de Ranking de Jugadores

-   **Componente Principal**: `PlayerRanking` (`src/components/jugadores/PlayerRanking.tsx`).
-   **Funcionalidad**:
    -   Presenta a los jugadores más destacados de la liga en función de diferentes métricas.
    -   Permite al usuario filtrar el ranking por **Goles**, **Asistencias** o **Partidos Jugados** mediante una serie de botones.
    -   Destaca al jugador número uno en la estadística seleccionada con una tarjeta de presentación (`FeaturedPlayer`) visualmente impactante.
    -   Muestra a los siguientes jugadores en una tabla limpia y fácil de leer.

### 4.3. Pestaña de Calendario

-   **Componente Principal**: `ScheduleCalendar` (`src/components/posiciones/ScheduleCalendar.tsx`).
-   **Funcionalidad**:
    -   Muestra todos los partidos de la temporada, agrupados por jornada y por fecha.
    -   **Filtro por Jornada**: Utiliza un componente de `Carousel` para permitir al usuario navegar y filtrar fácilmente entre las diferentes jornadas de la temporada.
    -   **Visualización Clara**: Cada partido se presenta en una tarjeta (`MatchItem`) que muestra los logos de los equipos y el resultado (si está finalizado), la hora (si está programado) o un indicador "EN VIVO" (si se está jugando).
    -   Cada tarjeta de partido es un enlace a la página de detalle del partido (`/partidos/[id]`).

## 5. Conclusión

La página de `/posiciones` está diseñada como un centro de datos multifuncional y eficiente. Su arquitectura de carga bajo demanda por pestañas optimiza el rendimiento, mientras que sus componentes de visualización especializados (`StandingsTable`, `PlayerRanking`, `ScheduleCalendar`) presentan la información de una manera clara, interactiva y visualmente atractiva, proporcionando a los usuarios una herramienta poderosa para seguir la liga.
