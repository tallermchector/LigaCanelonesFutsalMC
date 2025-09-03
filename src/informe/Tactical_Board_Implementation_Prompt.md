# Prompt para Implementación del Panel de Control Táctico Interactivo

Hola, necesito mejorar la página del tablero táctico en `src/app/cancha/[id]/page.tsx` para transformarla en un centro de control de partidos totalmente interactivo. Por favor, sigue estas instrucciones detalladas y mejores prácticas de desarrollo. El objetivo es replicar la robusta arquitectura de la página `/controles/[id]`, pero con una nueva interfaz visual centrada en el campo de juego, como se muestra en las imágenes de referencia.

### 1. Integración de la Gestión de Estado Centralizada

**Tarea:** Refactoriza la página `src/app/cancha/[id]/page.tsx` para que utilice el `GameProvider` existente.
**Detalles:**
-   Al igual que la página de control actual, la nueva página del tablero táctico debe estar envuelta por el `GameProvider`.
-   Esto le dará a la página y a todos sus componentes hijos acceso al estado centralizado del juego (`score`, `time`, `events`, `selectedPlayer`, etc.) y a la función `dispatch`.
-   Esto garantiza que cualquier acción realizada en el tablero táctico se refleje en un estado único y persistente, que se guarda en `localStorage` para sobrevivir a las actualizaciones de la página y se puede guardar en la base de datos.

### 2. Posicionamiento Inicial de Jugadores

**Tarea:** Modifica el componente `TacticalBoard` en `src/components/cancha/TacticalBoard.tsx` para colocar automáticamente a los jugadores en el campo al cargar.
**Detalles:**
-   Cuando el componente se monte, debe identificar a los 5 jugadores activos de cada equipo (`state.activePlayersA` y `state.activePlayersB`).
-   El **portero** de cada equipo debe ser identificado y colocado siempre junto a su arco respectivo.
-   Los otros cuatro jugadores de campo deben posicionarse en una **formación de estrella 1-2-1** en su lado correspondiente del campo.
-   Utiliza un `useEffect` que dependa de las listas de jugadores activos para inicializar y gestionar estas posiciones.

### 3. Desarrollo de Nuevos Componentes de Control Específicos para la Cancha

**Tarea:** Crea un nuevo conjunto de componentes de interfaz de usuario autocontenidos dentro del directorio `src/components/cancha/`. Estos componentes son exclusivos para la vista del tablero táctico y no deben modificar ni reutilizar los componentes de `src/components/controles/`.

-   **`TacticalHeader` (`src/components/cancha/TacticalHeader.tsx`):**
    -   Diseña un encabezado que muestre los logos y nombres de ambos equipos.
    -   En el centro, muestra el marcador actual (`scoreA` - `scoreB`), el cronómetro del partido (`time`) y el período actual (`period`).
    -   El estilo debe ser oscuro y semitransparente para complementar la vista táctica, como se ve en las imágenes.

-   **`ActionsToolbar` (`src/components/cancha/ActionsToolbar.tsx`):**
    -   Crea una barra de herramientas en la parte inferior de la pantalla.
    -   Incluye botones claros y basados en iconos para las acciones principales del tablero: 'Resetear Posiciones', 'Deshacer', 'Rehacer', 'Guardar Formación' y 'Configuración'. Utiliza `lucide-react` para los iconos.
    -   El diseño debe ser minimalista pero fácilmente accesible.

### 4. Habilitación de Acciones Interactivas de Jugador

**Tarea:** Mejora el componente `DraggablePlayer` para que sea interactivo al hacer clic.
**Detalles:**
-   Cuando se haga clic en un marcador de jugador (no al arrastrar), se debe activar la visualización de un menú de acciones.
-   **Implementa un `ActionMenu` emergente (popup/modal):**
    -   Este menú debe aparecer cerca del marcador del jugador seleccionado.
    -   Debe contener botones para registrar eventos de juego para ese jugador: `Gol`, `Asistencia`, `Tiro`, `Falta`, `Tarjeta Amarilla`, `Tarjeta Roja` y `Sustitución`.
    -   Al hacer clic en un botón de este menú, se debe despachar la acción apropiada al `GameProvider` para actualizar el estado central del juego. La lógica para añadir eventos debe ser manejada dentro del `gameReducer`.

### 5. Asegurar la Estructura de Componentes y el Flujo de Datos

**Tarea:** Organiza la estructura general para un flujo de datos claro y eficiente.
**Detalles:**
-   La página principal `src/app/cancha/[id]/page.tsx` será el punto de entrada, obteniendo los datos iniciales del partido y envolviendo el componente principal `TacticalBoard` con el `GameProvider`.
-   El componente `TacticalBoard` contendrá el fondo de la cancha, los marcadores de los jugadores (`DraggablePlayer`) y orquestará la visualización del `ActionMenu`.
-   `TacticalHeader` y `ActionsToolbar` se renderizarán junto con `TacticalBoard` y también consumirán datos del contexto `GameProvider` para mostrar información en tiempo real.

Siguiendo estos pasos, crearás un centro de control táctico altamente interactivo y funcional que aprovecha nuestra gestión de estado existente mientras mantiene una clara separación de responsabilidades para los nuevos componentes de la interfaz.
