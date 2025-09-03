# Informe de Módulo: Panel de Control Administrativo (`/controles/[id]`)

## 1. Resumen Ejecutivo

Este documento describe la arquitectura y funcionalidad de la página de **Panel de Control**, ubicada en `src/app/controles/[id]/page.tsx`. Esta página representa el centro de mando administrativo para la gestión de un partido. Está diseñada para ser una interfaz robusta y basada en formularios, donde los administradores pueden registrar eventos de manera precisa y sistemática utilizando botones y paneles de selección, en lugar de una interfaz visual de la cancha.

## 2. Arquitectura y Stack Tecnológico

La página está implementada como un **Componente de Cliente** (`'use client'`) para manejar la interactividad y el estado local.

- **Framework**: Next.js (App Router)
- **Librería UI**: React
- **Gestión de Estado**: `GameProvider` (React Context + `useReducer`), que centraliza todo el estado del partido.
- **Componentes UI**: ShadCN/UI, con un uso intensivo de componentes como `Card`, `Button` y `Separator`.
- **Acciones de Servidor**: Para la obtención y guardado de datos en la base de datos (`getMatchByIdFromDb`, `saveMatchState`).

## 3. Flujo de Datos y Lógica Principal

1.  **Carga de Datos**: Al igual que la pizarra táctica, la página carga los datos iniciales del partido utilizando una server action. Mientras los datos se cargan, se muestra un esqueleto de UI (`MatchControlSkeleton`) para una mejor UX.

2.  **Estado Centralizado**: La página está envuelta por el `GameProvider`, lo que le da acceso al estado compartido del partido. Esto es fundamental, ya que cualquier cambio realizado aquí (o en la pizarra táctica) se sincroniza a través de este contexto y se persiste en `localStorage`.

3.  **Interacción Basada en Paneles**: A diferencia de la pizarra táctica, la interacción del usuario se basa en hacer clic en los jugadores listados en los paneles laterales y luego hacer clic en los botones de acción centralizados. Es un enfoque más metódico y menos visual.

## 4. Desglose de Componentes Específicos

-   **`GameControls` (`src/components/controles/GameControls.tsx`)**:
    -   Es el componente principal que organiza el diseño de la página en tres columnas: un `TeamPanel` para cada equipo a los lados y un `ControlsPanel` en el centro.

-   **`Scoreboard` (`src/components/controles/Scoreboard.tsx`)**:
    -   Un componente de visualización prominente en la parte superior que muestra el marcador, los equipos, el tiempo, el período y las faltas. Es más grande y detallado que el `TacticalHeader`.

-   **`TeamPanel` (`src/components/controles/TeamPanel.tsx`)**:
    -   Un panel que lista a todos los jugadores de un equipo (titulares y suplentes) usando `JerseyButton`.
    -   Permite seleccionar a un jugador para atribuirle un evento. La selección de un jugador activa los botones de acción en el `EventButtons`.
    -   Gestiona la lógica para el modo de selección de titulares y para las sustituciones.

-   **`ControlsPanel` (`src/components/controles/ControlsPanel.tsx`)**:
    -   El panel central que contiene los controles principales del juego:
        -   Temporizador (iniciar, pausar, reiniciar).
        -   Selector de período.
        -   Botones para solicitar tiempos muertos para cada equipo.
        -   Botón para entrar en el modo "Definir Titulares".
        -   Botón para "Guardar y Salir", que persiste el estado en la base de datos.

-   **`EventButtons` (`src/components/controles/EventButtons.tsx`)**:
    -   Un conjunto de botones que se activan cuando se selecciona un jugador.
    -   Permite al administrador registrar eventos como Gol, Asistencia, Falta, Tarjetas y Sustituciones para el jugador seleccionado.
    -   Al hacer clic, despacha la acción correspondiente al `gameReducer`.

## 5. Conclusión

El Panel de Control Administrativo es una herramienta funcional y directa, optimizada para la entrada de datos de manera rápida y precisa. Su diseño basado en paneles y botones es ideal para un entorno donde la velocidad y la claridad del registro son más importantes que la representación visual del juego. Al compartir el mismo `GameProvider` que la pizarra táctica, garantiza la consistencia total del estado del partido, sin importar qué interfaz se utilice para gestionarlo.
