# Informe de Mejoras de Diseño y Experiencia de Usuario: Liga Canaria de Futsal

## Contexto y Objetivo

El objetivo de este informe es proponer una serie de mejoras estratégicas para fortalecer la identidad visual y la experiencia de usuario del sitio web de la "Liga Canaria de Futsal". Las recomendaciones se centran en crear una paleta de colores corporativa cohesiva, refinar el diseño general de la interfaz y añadir animaciones que aporten dinamismo sin sacrificar la usabilidad.

---

#### 1. Diseño General y Experiencia de Usuario (UX)

**Objetivo:** Crear una interfaz coherente, intuitiva y visualmente agradable que guíe al usuario de forma natural.

*   **Paleta de Colores Corporativa:** La paleta de colores actual, definida en `src/app/globals.css`, es sólida y coherente, con un buen contraste entre los colores de fondo, primarios y de acento.
    *   **Recomendación:** Mantener el uso estricto de las variables CSS (`hsl(var(--primary))`, `bg-background`, etc.) en lugar de colores fijos de Tailwind (como `bg-red-500`). Esto asegura que cualquier cambio futuro en la paleta se aplique de manera consistente en toda la aplicación.

*   **Tipografía y Jerarquía Visual:** La combinación de `Roboto` para el cuerpo del texto y `Orbitron` para los títulos (`font-orbitron`) es excelente para establecer una identidad visual fuerte y moderna.
    *   **Recomendación:** Aplicar `font-orbitron` de manera consistente a todos los títulos de página principales (`h1`) para reforzar la jerarquía y el estilo de la marca. El texto del cuerpo y los subtítulos deben seguir utilizando la fuente `Roboto` para una legibilidad óptima.

*   **Consistencia en el Layout:** El uso de componentes de `Card` de ShadCN para agrupar contenido relacionado es una excelente práctica que ya se está aplicando en la mayoría de las páginas de gestión.
    *   **Recomendación:** Asegurar que todos los formularios y secciones de contenido discreto estén envueltos en un componente `Card`. Esto crea un ritmo visual predecible para el usuario, haciendo que la interfaz sea más fácil de escanear y entender.

*   **Visualización de Datos:** Las tablas de datos son funcionales, pero en ciertas secciones como el listado de jugadores, se puede lograr un mayor impacto visual.
    *   **Mejora Implementada:** Se ha transformado la página de `/jugadores`, que antes mostraba una tabla simple, en una galería de tarjetas de jugador (`PlayerCard`). Este enfoque es más visual, moderno y permite destacar la identidad de cada jugador, alineándose mejor con el diseño de una plataforma deportiva.

---

#### 2. Animaciones y Transiciones

**Objetivo:** Añadir fluidez y dinamismo a la interfaz sin distraer al usuario.

*   **Microinteracciones Sutiles:** Las pequeñas animaciones en respuesta a las acciones del usuario mejoran enormemente la experiencia, haciendo que la interfaz se sienta más viva y receptiva.
    *   **Recomendación:** Utilizar las utilidades `group` y `group-hover` de Tailwind para crear efectos coordinados. Por ejemplo, al pasar el cursor sobre una `Card`, no solo la tarjeta debería reaccionar (ej. `group-hover:shadow-primary/20`), sino también sus elementos hijos (ej. un icono que cambia de color o un título que se subraya).

*   **Animaciones de Entrada:** Las animaciones que ocurren cuando los elementos entran en la vista del usuario pueden guiar la atención y hacer que la experiencia sea más atractiva.
    *   **Recomendación:** Aprovechar la librería `framer-motion` (ya instalada) para crear animaciones de entrada sutiles. Se ha creado un archivo `src/lib/animations.ts` con variantes predefinidas (`fadeIn`, `slideInUp`, `staggerContainer`) que pueden ser importadas y aplicadas fácilmente a los componentes `motion` para lograr efectos de aparición escalonados y elegantes.

*   **Transiciones de Página:** Aunque Next.js gestiona las transiciones de ruta de forma eficiente, añadir una animación sutil puede hacer que la navegación se sienta más fluida.
    *   **Recomendación:** Para las transiciones de página, se puede envolver el `{children}` en el layout principal (`src/app/layout.tsx`) con un componente `AnimatePresence` de `framer-motion` para definir animaciones de entrada y salida globales.

---

Este informe proporciona una base sólida para continuar mejorando el aspecto visual y la interacción de la aplicación, asegurando que la "Liga Canaria de Futsal" no solo sea funcionalmente robusta, sino también una plataforma atractiva y agradable de usar.
