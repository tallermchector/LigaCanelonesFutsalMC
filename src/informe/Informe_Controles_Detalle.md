# Informe de Módulo: Panel de Control de Partido (`/controles/[id]`)

## 1. Resumen Ejecutivo

Este documento ofrece un análisis técnico detallado de la página de control de partido, ubicada en `src/app/controles/[id]/page.tsx`. Esta página es el núcleo interactivo de la aplicación para los administradores de la liga, permitiendo la gestión en tiempo real de un partido de futsal. Su propósito es capturar todos los eventos de un partido (goles, faltas, cambios, etc.) y reflejarlos en un estado centralizado que se persiste y se puede transmitir a otras partes de la aplicación.

## 2. Arquitectura y Stack Tecnológico

La página está construida como un **Componente de Cliente** (`'use client'`) dentro del ecosistema de Next.js, lo cual es esencial para manejar la interactividad, los hooks de React (`useState`, `useEffect`, `useReducer`) y el estado del lado del cliente.

- **Framework**: Next.js (App Router)
- **Librería UI**: React
- **Gestión de Estado**: React Context API (`GameProvider`) y `useReducer`
- **Componentes UI**: ShadCN/UI
- **Acciones de Servidor**: Para la obtención y guardado de datos (`getMatchByIdFromDb`, `saveMatchState`).

## 3. Flujo de Datos y Lógica Principal

La página sigue un flujo de datos y renderizado claro y eficiente:

1.  **Obtención de ID de Partido**: Al cargar la página, utiliza el hook `useParams` de Next.js para extraer el `id` del partido desde la URL.

2.  **Carga de Datos Inicial**:
    -   Un hook `useEffect` se dispara al inicio para llamar a la Server Action `getMatchByIdFromDb(id)`.
    -   Mientras los datos se cargan, se muestra un componente de esqueleto (`MatchControlSkeleton`) para mejorar la experiencia del usuario.
    -   Si la carga de datos falla o el partido no se encuentra, se muestra un mensaje de error claro y se ofrecen opciones de navegación.

3.  **Gestión de Estado Centralizada con `GameProvider`**:
    -   Una vez que los datos del partido se han cargado (`const [match, setMatch]`), toda la interfaz de control se renderiza dentro del componente `GameProvider`.
    -   `GameProvider` (`src/contexts/GameProvider.tsx`) es el componente más crítico. Utiliza un `useReducer` para manejar toda la lógica de estado del partido (`score`, `time`, `fouls`, `events`, etc.).
    -   **Inicialización del Estado**: Al montarse, `GameProvider` intenta cargar el estado del partido desde el `localStorage` del navegador. Esto permite que un administrador pueda refrescar la página sin perder el estado actual del partido. Si no hay estado guardado, inicializa el estado con los datos del `match` obtenidos de la base de datos.
    -   **Persistencia**: Cada vez que el estado cambia (a través de `dispatch`), un `useEffect` dentro de `GameProvider` guarda automáticamente el nuevo estado en `localStorage`.

4.  **Guardado en Base de Datos**:
    -   El estado se gestiona localmente para un rendimiento óptimo durante el partido.
    -   Al hacer clic en "Guardar y Salir", se invoca la Server Action `saveMatchState(state)`, que toma el estado actual del `GameProvider` y lo persiste en la base de datos de Prisma.

## 4. Desglose de Componentes Hijos

La página delega la renderización de la UI a varios componentes especializados, todos los cuales consumen el estado y la función `dispatch` del `GameProvider` a través del hook `useGame`.

-   **`Scoreboard`**: Componente de solo lectura que muestra la información más relevante del partido: equipos, marcador, tiempo, período, faltas y tiempos muertos. Se actualiza automáticamente cada vez que el estado del `GameProvider` cambia.

-   **`EventButtons`**:
    -   Contiene los botones para registrar los principales eventos del juego: Gol, Asistencia, Falta, Tarjetas, etc.
    -   Estos botones están deshabilitados hasta que se selecciona un jugador (`state.selectedPlayer`).
    -   Al hacer clic, `dispatch`a una acción `ADD_EVENT` con el tipo de evento correspondiente. El `gameReducer` se encarga de crear el objeto del evento y actualizar el estado.

-   **`GameControls`**:
    -   Actúa como un contenedor que organiza el layout principal del panel de control.
    -   Renderiza los paneles de equipo (`TeamPanel`) a los lados y el panel de controles central (`ControlsPanel`).

-   **`TeamPanel`** (uno por cada equipo):
    -   Muestra la lista de jugadores del equipo, divididos entre titulares y suplentes.
    -   Utiliza el componente `JerseyButton` para representar a cada jugador.
    -   Permite seleccionar un jugador, cuyo `id` y `teamId` se guardan en `state.selectedPlayer`. Esta selección es crucial para que `EventButtons` sepa a quién atribuir un evento.
    -   Maneja la lógica visual para la selección de jugadores, el estado de sustitución y el modo de selección de titulares.

-   **`ControlsPanel`**:
    -   Gestiona el temporizador del partido (iniciar, pausar, reiniciar) y el cambio de período.
    -   Contiene la lógica para entrar en el modo "Definir Titulares" y para guardar el estado final del partido.

## 5. Conclusión

La página de control de partido es una pieza de ingeniería de frontend robusta e interactiva. El uso de un `GameProvider` centralizado con `useReducer` permite una gestión de estado predecible y escalable. La combinación de estado local en el cliente (con persistencia en `localStorage`) y el guardado explícito en la base de datos a través de Server Actions ofrece un rendimiento excelente durante el uso intensivo y garantiza la integridad de los datos a largo plazo. La arquitectura de componentes promueve la reutilización y la separación de responsabilidades, haciendo que el sistema sea fácil de mantener y extender.
