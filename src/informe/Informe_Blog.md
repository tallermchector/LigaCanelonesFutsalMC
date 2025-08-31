# Informe de Módulo: Blog de Noticias

## 1. Resumen Ejecutivo

Este documento detalla la arquitectura, funcionalidad y componentes del módulo de **Blog**, una sección clave de la aplicación **Liga Canelones Futsal**. El objetivo de este módulo es proporcionar a los usuarios las últimas noticias, análisis y artículos relacionados con la liga, presentados en un formato claro, atractivo y fácil de navegar.

El módulo está construido utilizando las mejores prácticas de Next.js, con un enfoque en el rendimiento, la escalabilidad y la optimización para motores de búsqueda (SEO).

## 2. Stack Tecnológico y Arquitectura

El módulo de Blog se basa en el stack tecnológico principal del proyecto:

- **Framework**: Next.js 14 (con App Router)
- **Librería UI**: React
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS y ShadCN/UI

La arquitectura está diseñada para separar la lógica de obtención de datos (backend) de la capa de presentación (frontend), utilizando Server Components de React por defecto para un rendimiento óptimo.

### Estructura de Archivos Relevante:

-   **Páginas (Rutas)**:
    -   `src/app/blog/page.tsx`: La página principal que lista todas las entradas del blog.
    -   `src/app/blog/[single]/page.tsx`: La página de detalle para una entrada de blog individual, utilizando una ruta dinámica.
-   **Componentes de Frontend**:
    -   `src/components/blog/PostCard.tsx`: Tarjeta de vista previa para cada post en la página de listado.
    -   `src/components/blog/Pagination.tsx`: Componente para navegar entre las páginas de posts.
    -   `src/components/layout/Header.tsx` y `Footer.tsx`: Componentes de diseño compartidos.
-   **Lógica de Backend (Capa de Datos)**:
    -   `src/actions/blog-actions.ts`: Server Actions que simulan la obtención de datos desde una base de datos.
    -   `src/data/posts.ts`: Archivo de datos simulados (mock data) que contiene las publicaciones del blog.
-   **Tipos**:
    -   `src/types/index.ts`: Contiene la definición del tipo `Post` para garantizar la consistencia de los datos.

## 3. Frontend: Páginas y Componentes

### 3.1. Página de Listado del Blog (`/blog`)

-   **Archivo**: `src/app/blog/page.tsx`
-   **Funcionalidad**:
    -   Muestra un título y una descripción de la sección del blog.
    -   Obtiene la lista de publicaciones llamando a la server action `getPosts()`.
    -   Mapea los datos de los posts y renderiza un componente `PostCard` para cada uno.
    -   El diseño presenta una imagen destacada a la izquierda y el título, fecha, y un extracto del contenido a la derecha.

### 3.2. Página de Post Individual (`/blog/[slug]`)

-   **Archivo**: `src/app/blog/[single]/page.tsx`
-   **Funcionalidad**:
    -   Es una ruta dinámica que toma el `slug` del post desde la URL.
    -   Utiliza `getPostBySlug(slug)` para obtener los datos del post específico. Si no se encuentra, muestra una página 404.
    -   Renderiza el título del post, la fecha de publicación y la imagen destacada.
    -   El contenido del post, que puede contener HTML, se renderiza de forma segura usando `dangerouslySetInnerHTML`.
    -   Incluye un botón "Volver al Blog" para una fácil navegación.
    -   **SEO**: Implementa `generateStaticParams` para pre-renderizar estáticamente cada página de blog en el momento de la construcción, mejorando el rendimiento y la indexación.

### 3.3. Componentes Específicos del Blog

-   **`PostCard` (`src/components/blog/PostCard.tsx`)**:
    -   Diseñado para ser una vista previa atractiva.
    -   Muestra la imagen, título, y un extracto del contenido del post.
    -   El título y la imagen son enlaces que llevan a la página del post completo.
-   **`BlogPagination` (`src/components/blog/Pagination.tsx`)**:
    -   Aunque actualmente no está implementado en la página principal, este componente está listo para ser utilizado.
    -   Permite la navegación entre múltiples páginas de resultados si el número de posts crece.

## 4. Backend: Lógica y Datos

La lógica del backend para el módulo de blog está completamente encapsulada en Server Actions, lo que permite que los componentes del frontend (que son Server Components) obtengan datos directamente sin necesidad de exponer APIs.

### 4.1. Acciones del Blog (`src/actions/blog-actions.ts`)

-   **`getPosts(page: number)`**:
    -   Simula la obtención de una lista paginada de posts.
    -   Filtra solo los posts marcados como `published`.
    -   Calcula el número total de páginas y devuelve solo los posts correspondientes a la página solicitada.
    -   Incluye un `setTimeout` para simular la latencia de una llamada de red.
-   **`getPostBySlug(slug: string)`**:
    -   Busca en los datos simulados un post que coincida con el `slug` proporcionado y que esté publicado.
    -   Devuelve el post encontrado o `undefined` si no existe, lo que permite a la página de detalle manejar el caso 404.

### 4.2. Datos Simulados (`src/data/posts.ts`)

-   **Archivo**: `src/data/posts.ts`
-   **Estructura**:
    -   Exporta un array `mockPosts` donde cada objeto cumple con la interfaz `Post` definida en `src/types/index.ts`.
    -   Cada post tiene un `id`, `title`, `slug`, `content` (como una cadena de HTML), `imageUrl`, una bandera `published`, y `createdAt`.
    -   Esta estructura desacoplada permite cambiar fácilmente la fuente de datos en el futuro (por ejemplo, a una base de datos real a través de Prisma) sin necesidad de modificar los componentes del frontend, solo las server actions.

## 5. Conclusión y Próximos Pasos

El módulo de Blog es funcional, robusto y está bien estructurado. La separación entre la lógica de datos y la presentación lo hace escalable y fácil de mantener.

**Posibles Mejoras Futuras**:

1.  **Integración con Base de Datos**: Reemplazar los datos simulados en `blog-actions.ts` con consultas a una base de datos real utilizando Prisma.
2.  **Implementar Paginación**: Utilizar el componente `BlogPagination` en la página `/blog` para manejar grandes volúmenes de posts.
3.  **CMS (Content Management System)**: Integrar un CMS (como Sanity, Contentful, o un CMS headless propio) para que los administradores puedan crear y editar posts sin necesidad de tocar el código.
4.  **Optimización de Imágenes**: Asegurarse de que las imágenes del blog se sirvan en formatos modernos (como WebP) y con tamaños adecuados para mejorar aún más los tiempos de carga.
