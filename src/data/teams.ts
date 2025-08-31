
import type { Team } from '@/types';

export const futsalTeams: Team[] = [
  { 
    id: 1, 
    name: 'Peñarol', 
    logoUrl: '/teams/peñarol.png',
    players: [
      { id: 101, name: 'L. Hernández', number: 10, position: 'Pivot' },
      { id: 102, name: 'N. Ordoqui', number: 8, position: 'Winger' },
      { id: 103, name: 'A. Sosa', number: 5, position: 'Defender' },
      { id: 104, name: 'F. Correa', number: 12, position: 'Goalkeeper' },
      { id: 105, name: 'M. Otero', number: 7, position: 'Winger' },
    ]
  },
  { 
    id: 2, 
    name: 'Nacional', 
    logoUrl: '/teams/nacional.png',
    players: [
      { id: 201, name: 'R. Catardo', number: 10, position: 'Winger' },
      { id: 202, name: 'G. Palleiro', number: 9, position: 'Pivot' },
      { id: 203, name: 'M. Varietti', number: 1, position: 'Goalkeeper' },
      { id: 204, name: 'F. Abelleira', number: 6, position: 'Defender' },
      { id: 205, name: 'L. Marcenal', number: 11, position: 'Winger' },
    ]
  },
  { id: 3, name: 'Old Christians', logoUrl: '/teams/old-christians.png', players: [] },
  { id: 4, name: 'Urupan', logoUrl: '/teams/urupan.png', players: [] },
  { id: 5, name: 'Río Branco', logoUrl: '/teams/rio-branco.png', players: [ { id: 301, name: 'R. Catardo', number: 10, position: 'Winger' },
    { id: 302, name: 'G. Palleiro', number: 9, position: 'Pivot' },
    { id: 303, name: 'M. Varietti', number: 1, position: 'Goalkeeper' },
    { id: 304, name: 'F. Abelleira', number: 6, position: 'Defender' },
    { id: 305, name: 'L. Marcenal', number: 11, position: 'Winger' },] },
  { id: 6, name: 'Boston River', logoUrl: '/teams/boston-river.png', players: [ { id: 401, name: 'R. Catardo', number: 10, position: 'Winger' },
    { id: 402, name: 'G. Palleiro', number: 9, position: 'Pivot' },
    { id: 403, name: 'M. Varietti', number: 1, position: 'Goalkeeper' },
    { id: 404, name: 'F. Abelleira', number: 6, position: 'Defender' },
    { id: 405, name: 'L. Marcenal', number: 11, position: 'Winger' },] },
  { id: 7, name: 'Rampla Jrs', logoUrl: '/teams/rampla-jrs.png', players: [] },
  { id: 8, name: 'Progreso', logoUrl: '/teams/progreso.png', players: [] },
  { id: 9, name: 'Montevideo', logoUrl: '/teams/montevideo.png', players: [] },
  { id: 10, name: 'Rocha FC', logoUrl: '/teams/rocha-fc.png', players: [] },
];
