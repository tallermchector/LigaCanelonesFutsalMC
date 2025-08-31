import type { Post } from '@/types';

export const mockPosts: Post[] = [
  {
    id: 1,
    title: '¡Comienza la temporada de Futsal en Canelones!',
    slug: 'comienza-temporada-futsal-canelones',
    content: '<p>El futsal vuelve a Canelones con más fuerza que nunca. Los equipos se preparan para una temporada que promete emociones fuertes y partidos inolvidables. ¡No te pierdas el arranque este fin de semana!</p>',
    imageUrl: 'https://picsum.photos/1200/600?random=1',
    published: true,
    createdAt: '2025-08-30T10:00:00Z',
  },
  {
    id: 2,
    title: 'Análisis de los favoritos al título',
    slug: 'analisis-favoritos-titulo',
    content: '<p>En este artículo analizamos a los principales candidatos para levantar la copa esta temporada. ¿Repetirá el campeón o tendremos una sorpresa?</p>',
    imageUrl: 'https://picsum.photos/1200/600?random=2',
    published: true,
    createdAt: '2025-08-29T12:30:00Z',
  },
  {
    id: 3,
    title: 'La figura de la primera fecha',
    slug: 'figura-primera-fecha',
    content: '<p>Repasamos la actuación del jugador más destacado de la primera jornada, autor de un hat-trick y pieza clave en la victoria de su equipo.</p>',
    imageUrl: 'https://picsum.photos/1200/600?random=3',
    published: true,
    createdAt: '2025-08-28T18:00:00Z',
  },
  {
    id: 4,
    title: 'Entrevista exclusiva con el DT del equipo revelación',
    slug: 'entrevista-dt-revelacion',
    content: '<p>Conversamos con el entrenador del equipo que dio la sorpresa en la primera fecha. Nos cuenta las claves de su preparación y sus aspiraciones para el campeonato.</p>',
    imageUrl: 'https://picsum.photos/1200/600?random=4',
    published: true,
    createdAt: '2025-08-27T09:00:00Z',
  },
  {
    id: 5,
    title: 'Próxima fecha: Duelos clave en la parte alta de la tabla',
    slug: 'proxima-fecha-duelos-clave',
    content: '<p>La segunda fecha trae enfrentamientos directos entre los equipos que picaron en punta. Analizamos los partidos que no te puedes perder.</p>',
    imageUrl: 'https://picsum.photos/1200/600?random=5',
    published: true,
    createdAt: '2025-08-26T15:00:00Z',
  },
];
