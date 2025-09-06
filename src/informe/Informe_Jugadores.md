# Informe de Módulo: Páginas de Jugadores

## 1. Resumen Ejecutivo

Este documento detalla la arquitectura, funcionalidad y componentes de las páginas de **Jugadores**, que incluyen la página de listado y ranking (`/jugadores`) y la página de perfil de cada jugador (`/jugadores/[id]`). Este módulo es vital para conectar a los aficionados con los atletas de la liga, permitiéndoles seguir el rendimiento y conocer más sobre sus jugadores favoritos.

## 2. Arquitectura y Stack Tecnológico

El módulo de Jugadores utiliza el stack tecnológico principal del proyecto, con un enfoque en la carga de datos del lado del servidor y la interactividad del lado del cliente donde sea necesario.

-   **Páginas (Rutas)**:
    -   `src/app/jugadores/page.tsx`: Muestra un ranking de jugadores basado en estadísticas clave (goles, asistencias, etc.).
    -   `src/app/jugadores/[id]/page.tsx`: Página de perfil detallada para un jugador individual.
-   **Componentes Clave**:
    -   `PlayerRanking`: Componente interactivo que muestra a los jugadores clasificados y permite filtrar por diferentes estadísticas.
    -   `PlayerCard`: Tarjeta de presentación para cada jugador.
    -   `PlayerHero`: Cabecera de la página de perfil con la imagen, nombre y equipo del jugador.
    -   `PlayerInfoTabs`: Pestañas para navegar entre el resumen y las estadísticas del jugador.
    -   `PlayerBasicInfo` y `PlayerStats`: Componentes que muestran los datos biográficos y de rendimiento del jugador.
-   **Lógica de Backend**:
    -   `src/actions/player-actions.ts`: Contiene las `server actions` (`getAggregatedPlayerStats`, `getPlayerById`) para obtener los datos de los jugadores.

## 3. Sugerencias de Mejora y Componentes Adicionales

### 3.1. Página de Ranking de Jugadores (`/jugadores`)

-   **Estado Actual**: La página presenta un ranking funcional con un jugador destacado y una tabla para el resto.
-   **Sugerencia de Mejora**:
    -   **Rediseñar `PlayerRanking`**: Aunque funcional, el diseño puede ser más dinámico. La tarjeta del jugador destacado (`FeaturedPlayer`) puede hacerse más grande e impactante, utilizando el fondo para crear un ambiente más inmersivo. La tabla de los demás jugadores debe tener una jerarquía visual clara, con enlaces fáciles de seguir tanto para el perfil del jugador como para el de su equipo.
    -   **Mejorar `PlayerCard`**: La tarjeta de jugador individual puede ser más visualmente atractiva, utilizando el avatar del jugador sobre un fondo relacionado con su equipo o la liga, y presentando la información de manera más integrada.

### 3.2. Página de Perfil del Jugador (`/jugadores/[id]`)

-   **Estado Actual**: La página tiene una estructura básica con una cabecera, pestañas y tarjetas de información.
-   **Sugerencia de Mejora**:
    -   **`PlayerHero` dinámico**: La sección de la cabecera debería ser más que una simple imagen. Puede incorporar el número del jugador como un elemento de diseño de fondo y utilizar el logo de su equipo para reforzar la identidad visual.
    -   **Pestañas de Navegación Fijas (`sticky`)**: Las pestañas de "Resumen" y "Estadísticas" deberían permanecer fijas en la parte superior de la ventana (`sticky`) mientras el usuario se desplaza hacia abajo. Esto mejora drásticamente la navegación en perfiles con mucha información.
    -   **Contenido de Pestañas**: Actualmente, las pestañas no tienen contenido diferenciado. La pestaña "Resumen" debería mostrar `PlayerBasicInfo` y las `PlayerStats`, mientras que la pestaña "Estadísticas" podría albergar futuras visualizaciones más detalladas, como gráficos de rendimiento por partido.

## 4. Conclusión

El módulo de Jugadores es fundamental para la interacción de los aficionados. Las mejoras propuestas, como un ranking más visual, perfiles de jugador más dinámicos y una navegación mejorada con pestañas fijas, transformarán estas páginas de simples listados de datos a una experiencia de usuario de alta calidad, similar a la de las grandes plataformas deportivas. Esto no solo mejora la estética, sino que también facilita que los usuarios encuentren y consuman la información que buscan.