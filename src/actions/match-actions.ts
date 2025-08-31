'use server';

import type { FullMatch, MatchStatus } from '@/types';
import { futsalTeams } from '@/data/teams';

// Mock data generation
function createMockMatch(id: number, status: MatchStatus): FullMatch {
  const teamAIndex = id % futsalTeams.length;
  let teamBIndex = (id + 1) % futsalTeams.length;
  if (teamAIndex === teamBIndex) {
    teamBIndex = (teamBIndex + 1) % futsalTeams.length;
  }

  const now = new Date();
  let scheduledTime: Date;
  let scoreA = 0;
  let scoreB = 0;

  switch (status) {
    case 'SCHEDULED':
      scheduledTime = new Date(now.getTime() + (id + 1) * 24 * 60 * 60 * 1000 + 100000);
      break;
    case 'LIVE':
      scheduledTime = new Date(now.getTime() - 30 * 60 * 1000); // 30 mins ago
      break;
    case 'FINISHED':
       scheduledTime = new Date(now.getTime() - (id + 1) * 3 * 60 * 60 * 1000); // Few hours/days ago
       scoreA = (id % 5) + 1;
       scoreB = ((id + 3) % 5);
      break;
  }

  return {
    id: `match-${id}`,
    scheduledTime: scheduledTime.toISOString(),
    status,
    teamA: futsalTeams[teamAIndex],
    teamB: futsalTeams[teamBIndex],
    scoreA,
    scoreB,
  };
}

const mockMatches: FullMatch[] = [
  ...Array.from({ length: 4 }, (_, i) => createMockMatch(i, 'SCHEDULED')),
  ...Array.from({ length: 2 }, (_, i) => createMockMatch(i + 4, 'LIVE')),
  ...Array.from({ length: 6 }, (_, i) => createMockMatch(i + 6, 'FINISHED')),
];

export async function getAllMatches(): Promise<FullMatch[]> {
  console.log('Fetching all matches...');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, you would fetch this from a database.
  return mockMatches;
}

export async function getMatchById(id: string): Promise<FullMatch | undefined> {
  console.log(`Fetching match with id: ${id}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const match = mockMatches.find(m => m.id === id);
  
  return match;
}
