
'use server';

import type { FullMatch, MatchStatus, MatchStats, GameEvent, Player, Team, GameEventType } from '@/types';
import { futsalTeams } from '@/data/teams';

// Helper to get a random player from a team
const getRandomPlayer = (team: Team, index: number): Player | undefined => {
  if (!team.players || team.players.length === 0) return undefined;
  const playerIndex = index % team.players.length;
  return team.players[playerIndex];
};

// Mock data generation
function createMockMatch(id: number, status: MatchStatus): FullMatch {
  const teamAIndex = id % futsalTeams.length;
  let teamBIndex = (id + 1) % futsalTeams.length;
  if (teamAIndex === teamBIndex) {
    teamBIndex = (teamBIndex + 1) % futsalTeams.length;
  }
  const teamA = futsalTeams[teamAIndex];
  const teamB = futsalTeams[teamBIndex];

  const now = new Date();
  let scheduledTime: Date;
  let scoreA = 0;
  let scoreB = 0;
  const events: GameEvent[] = [];

  switch (status) {
    case 'SCHEDULED':
      scheduledTime = new Date(now.getTime() + (id + 1) * 24 * 60 * 60 * 1000 + 100000);
      break;
    case 'LIVE':
      scheduledTime = new Date(now.getTime() - 30 * 60 * 1000); // 30 mins ago
      scoreA = (id % 3); 
      scoreB = ((id + 1) % 3);
      break;
    case 'FINISHED':
       scheduledTime = new Date(now.getTime() - (id + 1) * 3 * 60 * 60 * 1000); // Few hours/days ago
       scoreA = (id % 4) + 1; // Example: 1-4 goals
       scoreB = ((id + 2) % 4); // Example: 0-3 goals
       
       // Generate mock events
       for (let i = 0; i < scoreA; i++) {
         const player = getRandomPlayer(teamA, i);
         if (player) {
           events.push({ id: `evt-a-goal-${i}`, type: 'GOAL', teamId: 'A', playerId: player.id, playerName: player.name, teamName: teamA.name, timestamp: 600 + i * 120 });
           // Add a chance for an assist
           if (i % 2 === 0) {
             const assister = getRandomPlayer(teamA, i + 1);
             if (assister && assister.id !== player.id) {
               events.push({ id: `evt-a-assist-${i}`, type: 'ASSIST', teamId: 'A', playerId: assister.id, playerName: assister.name, teamName: teamA.name, timestamp: 600 + i * 120 - 5 });
             }
           }
         }
       }
        for (let i = 0; i < scoreB; i++) {
         const player = getRandomPlayer(teamB, i);
         if (player) {
           events.push({ id: `evt-b-goal-${i}`, type: 'GOAL', teamId: 'B', playerId: player.id, playerName: player.name, teamName: teamB.name, timestamp: 700 + i * 150 });
         }
       }
       // Add some foul events
       for (let i = 0; i < 3; i++) {
          const playerA = getRandomPlayer(teamA, i);
          if (playerA) events.push({ id: `evt-a-foul-${i}`, type: 'FOUL', teamId: 'A', playerId: playerA.id, playerName: playerA.name, teamName: teamA.name, timestamp: 300 + i * 200 });
          const playerB = getRandomPlayer(teamB, i);
          if (playerB) events.push({ id: `evt-b-foul-${i}`, type: 'FOUL', teamId: 'B', playerId: playerB.id, playerName: playerB.name, teamName: teamB.name, timestamp: 400 + i * 250 });
       }
      break;
  }

  return {
    id: `match-${id}`,
    scheduledTime: scheduledTime.toISOString(),
    status,
    teamA,
    teamB,
    scoreA,
    scoreB,
    events,
  };
}

const mockMatches: FullMatch[] = [
  ...Array.from({ length: 4 }, (_, i) => createMockMatch(i, 'SCHEDULED')),
  ...Array.from({ length: 2 }, (_, i) => createMockMatch(i + 4, 'LIVE')),
  ...Array.from({ length: 6 }, (_, i) => createMockMatch(i + 6, 'FINISHED')),
];

export async function getAllMatches(): Promise<FullMatch[]> {
  console.log('Fetching all matches...');
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMatches;
}

export async function getLiveMatches(): Promise<FullMatch[]> {
    console.log('Fetching live matches...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMatches.filter(match => match.status === 'LIVE');
}

export async function getFinishedMatches(): Promise<FullMatch[]> {
    console.log('Fetching finished matches...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMatches.filter(match => match.status === 'FINISHED');
}

export async function getMatchById(id: string): Promise<FullMatch | undefined> {
  console.log(`Fetching match with id: ${id}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const match = mockMatches.find(m => m.id === id);
  return match;
}

export async function getMatchStats(id: string): Promise<MatchStats | undefined> {
  const match = await getMatchById(id);
  if (!match || !match.events) {
    return undefined;
  }

  const allPlayers = [...match.teamA.players, ...match.teamB.players];

  const getStatsForType = (eventType: GameEventType) => {
    const eventCounts = match.events!
      .filter(event => event.type === eventType)
      .reduce((acc, event) => {
        acc[event.playerId] = (acc[event.playerId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

    return Object.entries(eventCounts)
      .map(([playerId, count]) => {
        const player = allPlayers.find(p => p.id === parseInt(playerId, 10));
        return player ? { player, count } : null;
      })
      .filter((p): p is { player: Player, count: number } => p !== null)
      .sort((a, b) => b.count - a.count);
  };
  
  const topScorers = getStatsForType('GOAL');
  const assistsLeaders = getStatsForType('ASSIST');
  const foulsByPlayer = getStatsForType('FOUL');
  const shotsByPlayer = getStatsForType('SHOT');


  return {
    ...match,
    stats: {
      topScorers: topScorers,
      assistsLeaders: assistsLeaders,
      foulsByPlayer: foulsByPlayer,
      shotsByPlayer: shotsByPlayer,
    },
  };
}
