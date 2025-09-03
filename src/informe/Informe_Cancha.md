# Informe de Módulo: Pizarra Táctica Interactiva (`/cancha/[id]`)

## 1. Resumen Ejecutivo

Este documento detalla la arquitectura y funcionalidad de la página de **Pizarra Táctica**, accesible en `src/app/cancha/[id]/page.tsx`. Esta interfaz es el centro de mando visual y estratégico para la gestión de un partido en tiempo real. Su diseño se centra en la representación espacial de los jugadores en el campo, permitiendo a los entrenadores y administradores no solo analizar formaciones, sino también registrar eventos del partido de manera intuitiva y directa desde la cancha virtual.

## 2. Arquitectura y Stack Tecnológico

La página está diseñada como un **Componente de Cliente** (`'use client'`) para permitir una alta interactividad.

- **Framework**: Next.js (App Router)
- **Librería UI**: React
- **Gestión de Estado**: `GameProvider` (React Context + `useReducer`), que centraliza todo el estado del partido (marcador, tiempo, jugadores, eventos, etc.).
- **Arrastrar y Soltar**: `react-dnd` y `react-dnd-html5-backend` para el movimiento de jugadores en el tablero.
- **Componentes UI**: ShadCN/UI.

## 3. Flujo de Datos y Lógica Principal

1.  **Carga Inicial**: La página obtiene el `id` del partido de la URL y carga los datos iniciales del partido desde la base de datos usando la server action `getMatchByIdFromDb`.
2.  **Contexto Global**: Toda la interfaz está envuelta por `GameProvider`, que inyecta el estado del juego y la función `dispatch` a todos los componentes hijos. Esto asegura un único punto de verdad para el estado del partido.
3.  **Interactividad Visual**: El usuario interactúa directamente con los elementos visuales (jugadores en la cancha) para registrar acciones, lo que ofrece una experiencia de gestión más inmersiva que un panel de control tradicional.

## 4. Desglose de Componentes Específicos

-   **`TacticalBoard` (`src/components/cancha/TacticalBoard.tsx`)**:
    -   Es el componente principal que renderiza el fondo de la cancha de futsal.
    -   Actúa como un área de destino (drop zone) para los jugadores que se arrastran.
    -   Renderiza los `DraggablePlayer` en sus posiciones actuales, obtenidas del `playerPositions` en el estado del juego.

-   **`DraggablePlayer` (`src/components/cancha/DraggablePlayer.tsx`)**:
    -   Representa a un jugador en el campo con su número de camiseta.
    -   Se puede arrastrar y soltar en el `TacticalBoard` para actualizar su posición.
    -   Al hacer clic, abre un `ActionMenu` para registrar eventos específicos para ese jugador.

-   **`ActionMenu` (`src/components/cancha/ActionMenu.tsx`)**:
    -   Un menú emergente (Popover) que aparece al hacer clic en un `DraggablePlayer`.
    -   Contiene botones para todas las acciones del juego (Gol, Falta, Tarjeta, etc.).
    -   Cada botón despacha la acción correspondiente al `gameReducer` a través del `GameProvider`.

-   **`TacticalHeader` (`src/components/cancha/TacticalHeader.tsx`)**:
    -   Un encabezado minimalista y oscuro que muestra la información esencial del partido: equipos, marcador y tiempo, diseñado para no distraer de la acción en la pizarra.

-   **`TacticalActions` (`src/components/cancha/TacticalActions.tsx`)**:
    -   Una barra de herramientas inferior que contiene los controles globales del partido: iniciar/pausar el tiempo, cambiar de período, pedir tiempos muertos y guardar el estado del partido en la base de datos.

-   **`TeamPanel` (`src/components/controles/TeamPanel.tsx`)**:
    -   Reutilizado del módulo de controles, este componente se muestra a los lados de la pizarra.
    -   Lista a todos los jugadores del equipo (titulares y suplentes) y permite seleccionarlos, ya sea para iniciar una acción o para realizar una sustitución.

## 5. Conclusión

La página de Pizarra Táctica ofrece una forma muy visual e interactiva de gestionar un partido. Al combinar la representación táctica con la capacidad de registrar eventos directamente, crea una herramienta potente y moderna para entrenadores y administradores. Su dependencia del `GameProvider` asegura que toda la lógica de negocio y el estado del partido se mantengan consistentes en toda la aplicación.
