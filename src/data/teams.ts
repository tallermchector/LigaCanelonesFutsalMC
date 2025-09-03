
import type { Team } from '@/types';
import { players } from './players';

const baseTeams: Omit<Team, 'players'>[] = [
  {
    id: 1,
    name: "LOS QUITU",
    logoUrl: "/equipos/1.png",
    slug: "los-quitu",
  },
  {
    id: 10,
    name: "LA PAPA MADRE",
    logoUrl: "/equipos/10.png",
    slug: "la-papa-madre",
  },
  {
    id: 11,
    name: "WANDERERS",
    logoUrl: "/equipos/11.png",
    slug: "wanderers",
  },
  {
    id: 12,
    name: "JCC 1930",
    logoUrl: "/equipos/12.png",
    slug: "jcc-1930",
  },
  {
    id: 13,
    name: "STELLA",
    logoUrl: '/equipos/13.png',
    slug: "stella",
  },
  {
    id: 14,
    name: "REAL CANELONES",
    logoUrl: "/equipos/14.png",
    slug: "real-canelones",
  },
  {
    id: 15,
    name: "DAC",
    logoUrl: "/equipos/15.png",
    slug: "dac",
  },
  {
    id: 2,
    name: "VALDEARCOS",
    logoUrl: "/equipos/2.png",
    slug: "valdearcos",
  },
  {
    id: 3,
    name: "NEGRIAZUL",
    logoUrl: "/equipos/3.png",
    slug: "negriazul",
  },
  {
    id: 4,
    name: "PEDRENSE",
    logoUrl: "/equipos/4.png",
    slug: "pedrense",
  },
  {
    id: 5,
    name: "LA PIECITA",
    logoUrl: "/equipos/5.png",
    slug: "la-piecita",
  },
  {
    id: 6,
    name: "EL HACHA",
    logoUrl: "/equipos/6.png",
    slug: "el-hacha",
  },
  {
    id: 7,
    name: "MILANO",
    logoUrl: "/equipos/7.png",
    slug: "milano",
  },
  {
    id: 8,
    name: "T. DE CAMPEONES",
    logoUrl: "/equipos/8.png",
    slug: "t-de-campeones",
  },
  {
    id: 9,
    name: "CAPINCHO",
    logoUrl: '/equipos/9.png',
    slug: "capincho",
  }
];


// Distribute players to teams
export const futsalTeams: Team[] = baseTeams.map((team, index) => {
  const startIndex = index * 10;
  const endIndex = startIndex + 10;
  return {
    ...team,
    players: players.slice(startIndex, endIndex)
  };
});
