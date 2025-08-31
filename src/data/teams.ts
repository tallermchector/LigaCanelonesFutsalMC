
import type { Team } from '@/types';
import { players } from './players';

const baseTeams: Omit<Team, 'players'>[] = [
  {
    id: 1,
    name: "LOS QUITU",
    logoUrl: "/equipos/1.png",
  },
  {
    id: 10,
    name: "LA PAPA MADRE",
    logoUrl: "/equipos/10.png",
  },
  {
    id: 11,
    name: "WANDERERS",
    logoUrl: "/equipos/11.png",
  },
  {
    id: 12,
    name: "JCC 1930",
    logoUrl: "/equipos/12.png",
  },
  {
    id: 13,
    name: "STELLA",
    logoUrl: "/equipos/13.png",
  },
  {
    id: 14,
    name: "REAL CANELONES",
    logoUrl: "/equipos/14.png",
  },
  {
    id: 15,
    name: "DAC",
    logoUrl: "/equipos/15.png",
  },
  {
    id: 2,
    name: "VALDEARCOS",
    logoUrl: "/equipos/2.png",
  },
  {
    id: 3,
    name: "NEGRIAZUL",
    logoUrl: "/equipos/3.png",
  },
  {
    id: 4,
    name: "PEDRENSE",
    logoUrl: "/equipos/4.png",
  },
  {
    id: 5,
    name: "LA PIECITA",
    logoUrl: "/equipos/5.png",
  },
  {
    id: 6,
    name: "EL HACHA",
    logoUrl: "/equipos/6.png",
  },
  {
    id: 7,
    name: "MILANO",
    logoUrl: "/equipos/7.png",
  },
  {
    id: 8,
    name: "T. DE CAMPEONES",
    logoUrl: "/equipos/8.png",
  },
  {
    id: 9,
    name: "CAPINCHO",
    logoUrl: "/equipos/9.png",
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
