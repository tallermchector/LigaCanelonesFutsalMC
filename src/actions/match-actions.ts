
'use server';

import prisma from '@/lib/prisma';
import type { Match, Team, Player, GameEvent } from '@prisma/client';
import type { MatchStatus } from '@/types';


export type { Match, Team, Player, MatchStatus, GameEvent, PlayerPosition, MatchPlayer };

export type FullMatch = Match & {
  teamA: Team & { players: Player[] };
  teamB: Team & { players: Player[] };
  matchPlayers: MatchPlayer[];
};

export type LiveMatch = Match & {
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  time: number; 
  period: number;
}

export type MatchWithTeams = Match & {
  teamA: Team;
  teamB: Team;
};

export type GameEventWithTeamAndPlayer = GameEvent & {
  team: Team;
  player: Player | null;
};

export type MatchStats = Match & {
  teamA: Team;
  teamB: Team;
  gameEvents: GameEventWithTeamAndPlayer[];
  stats: {
    teamA: { possession: number; shots: number; shotsOnTarget: number; };
    teamB: { possession: number; shots: number; shotsOnTarget: number; };
  };
  mvp: Player | null;
};

export type Matchday = {
  matchday: number;
  matches: MatchWithTeams[];
}

type CreateMatchData = {
  teamAId: number;
  teamBId: number;
  scheduledTime: Date;
  round: number;
}

export async function createMatch(data: CreateMatchData): Promise<Match> {
  const { teamAId, teamBId, scheduledTime, round } = data;

  if (teamAId === teamBId) {
    throw new Error("Team A and Team B cannot be the same.");
  }

  const newMatch = await prisma.match.create({
    data: {
      teamAId,
      teamBId,
      scheduledTime,
      status: 'SCHEDULED',
      scoreA: 0,
      scoreB: 0,
      round,
      period: 1,
      time: 1200,
      foulsA: 0,
      foulsB: 0,
      timeoutsA: 0,
      timeoutsB: 0,
      isRunning: false,
      activePlayersA: [],
      activePlayersB: [],
    }
  });
  return newMatch;
}

export async function updateMatchStatus(matchId: number, status: MatchStatus): Promise<Match> {
  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: { status },
  });
  return updatedMatch;
}

export async function updateMatchdayStatus(matchIds: number[], status: MatchStatus): Promise<void> {
  await prisma.match.updateMany({
    where: {
      id: { in: matchIds },
      status: 'SCHEDULED',
    },
    data: {
      status,
    },
  });
}

export async function getLiveMatches(): Promise<LiveMatch[]> {
  const liveMatches = await prisma.match.findMany({
    where: { status: 'LIVE' },
    include: { teamA: true, teamB: true },
    orderBy: { scheduledTime: 'asc' },
  });

  return liveMatches.map((match: MatchWithTeams) => ({
    ...match,
    scoreA: match.scoreA ?? 0,
    scoreB: match.scoreB ?? 0,
    time: match.time ?? 0,
    period: match.period ?? 1,
  }));
}

export async function getNextMatches(): Promise<FullMatch[]> {
    const matches = await prisma.match.findMany({
        where: { status: 'SCHEDULED' },
        include: {
            teamA: { include: { players: true } },
            teamB: { include: { players: true } },
            matchPlayers: true,
        },
        orderBy: {
            scheduledTime: 'asc'
        },
        take: 5
    });
    return matches as unknown as FullMatch[];
}


export async function getMatchData(matchId: string): Promise<FullMatch | null> {
  const match = await prisma.match.findUnique({
    where: { id: parseInt(matchId) },
    include: {
      teamA: {
        include: {
          players: true,
        }
      },
      teamB: {
        include: {
          players: true,
        }
      },
      matchPlayers: true,
    }
  });

  return match as unknown as FullMatch;
}

export async function getAllMatches(seasonId?: number): Promise<FullMatch[]> {
  return prisma.match.findMany({
    where: seasonId ? { round: seasonId } : {}, // Assuming seasonId corresponds to round for now
    include: {
        teamA: { include: { players: true } },
        teamB: { include: { players: true } },
        matchPlayers: true,
    },
    orderBy: {
      scheduledTime: 'asc'
    }
  }) as unknown as FullMatch[];
}

export async function getMatchStats(matchId: string): Promise<MatchStats | null> {
  const matchWithEvents = await prisma.match.findUnique({
    where: { id: parseInt(matchId) },
    include: {
      teamA: true,
      teamB: true,
      events: {
        include: {
            player: true,
        },
        orderBy: {
            timestamp: 'asc'
        }
      }
    }
  });

  if (!matchWithEvents) {
    return null;
  }

  const { events, ...matchData } = matchWithEvents;

  const statsA = { shots: 0, shotsOnTarget: 0 };
  const statsB = { shots: 0, shotsOnTarget: 0 };
  const playerStats: Record<number, { goals: number, assists: number }> = {};

  const gameEvents: GameEventWithTeamAndPlayer[] = events.map(event => ({...event, team: event.teamId === matchData.teamAId ? matchData.teamA : matchData.teamB }));


  gameEvents.forEach((event: GameEventWithTeamAndPlayer) => {
    const teamId = event.teamId;
    if (event.type === 'SHOT' || event.type === 'GOAL') {
      if (teamId === matchData.teamAId) {
        statsA.shots++;
        if (event.type === 'GOAL') statsA.shotsOnTarget++;
      } else {
        statsB.shots++;
        if (event.type === 'GOAL') statsB.shotsOnTarget++;
      }
    }

    if (event.playerId) {
      if (!playerStats[event.playerId]) {
        playerStats[event.playerId] = { goals: 0, assists: 0 };
      }
      if (event.type === 'GOAL') {
        playerStats[event.playerId].goals++;
      }
      if (event.type === 'ASSIST') {
        playerStats[event.playerId].assists++;
      }
    }
  });

  let mvp: Player | null = null;
  let maxGoals = 0;
  let maxAssists = 0;

  for (const playerIdStr in playerStats) {
    const playerId = parseInt(playerIdStr);
    const pStats = playerStats[playerId];
    if (pStats.goals > maxGoals || (pStats.goals === maxGoals && pStats.assists > maxAssists)) {
      maxGoals = pStats.goals;
      maxAssists = pStats.assists;
      const playerRecord = await prisma.player.findUnique({ where: { id: playerId } });
      mvp = playerRecord;
    }
  }

  if (!mvp && matchData.status === 'FINISHED') {
    const winningTeamId = (matchData.scoreA ?? 0) > (matchData.scoreB ?? 0)
      ? matchData.teamA.id
      : ((matchData.scoreB ?? 0) > (matchData.scoreA ?? 0) ? matchData.teamB.id : null);
    if (winningTeamId) {
      mvp = await prisma.player.findFirst({ where: { teamId: winningTeamId } });
    }
  }

  const possessionA = Math.floor(Math.random() * (60 - 40 + 1)) + 40;

  return {
    ...matchData,
    gameEvents,
    stats: {
      teamA: { ...statsA, possession: possessionA },
      teamB: { ...statsB, possession: 100 - possessionA },
    },
    mvp: mvp,
  };
}

export async function generateFixture(seasonId: number, teamIds: number[]): Promise<Match[]> {
  if (teamIds.length < 2) {
    return [];
  }

  let teams = [...teamIds];
  if (teams.length % 2 !== 0) {
    teams.push(0); 
  }

  const numTeams = teams.length;
  const numRounds = numTeams - 1;
  const matchesToCreate = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 7);
  baseDate.setUTCHours(19, 15, 0, 0);
  let matchDate = new Date(baseDate);

  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < numTeams / 2; i++) {
      const teamAId = teams[i];
      const teamBId = teams[numTeams - 1 - i];

      if (teamAId !== 0 && teamBId !== 0) {
        matchesToCreate.push({
          teamAId,
          teamBId,
          scheduledTime: new Date(matchDate),
          round: round + 1,
          status: 'SCHEDULED' as MatchStatus,
          scoreA: 0,
          scoreB: 0,
          period: 1,
          time: 1200,
          foulsA: 0,
          foulsB: 0,
          timeoutsA: 1,
          timeoutsB: 1,
          isRunning: false,
          activePlayersA: [],
          activePlayersB: [],
        });
      }
    }
    const lastTeam = teams.pop()!;
    teams.splice(1, 0, lastTeam);
    matchDate.setDate(matchDate.getDate() + (round % 2 === 0 ? 2 : 5));
  }

  const lastFirstRoundDate = new Date(matchesToCreate[matchesToCreate.length - 1].scheduledTime);
  matchDate = new Date(lastFirstRoundDate);
  matchDate.setDate(matchDate.getDate() + 14);


  const secondRoundMatches = matchesToCreate.slice(0, (numTeams - 1) * (numTeams / 2)).map((match, index) => {
    if (index > 0 && index % (numTeams / 2) === 0) {
      const previousMatchDate = new Date(matchesToCreate[index - 1].scheduledTime);
      const currentMatchDate = new Date(matchesToCreate[index].scheduledTime);
      const diffDays = (currentMatchDate.getTime() - previousMatchDate.getTime()) / (1000 * 3600 * 24);
      matchDate.setDate(matchDate.getDate() + diffDays);
    }

    return {
      ...match,
      teamAId: match.teamBId,
      teamBId: match.teamAId,
      scheduledTime: new Date(matchDate.getTime() + index * 1000),
      round: match.round + numRounds,
    };
  });

  const allMatchesData = [...matchesToCreate, ...secondRoundMatches];

  await prisma.match.createMany({
    data: allMatchesData,
  });

  return prisma.match.findMany({ where: { round: { gte: 1, lte: numRounds * 2 } } });
}


export async function savePlayerRoster(matchId: string, teamId: number, playerIds: number[]): Promise<void> {
    await prisma.matchPlayer.deleteMany({
        where: {
            matchId: parseInt(matchId),
            teamId: teamId,
        },
    });
    const data = playerIds.map(playerId => ({
        matchId: parseInt(matchId),
        playerId,
        teamId,
    }));

    await prisma.matchPlayer.createMany({
        data,
    });
}

export async function getMatchdays(seasonId: number): Promise<Matchday[]> {
  const seasonTeams = await prisma.seasonTeam.findMany({ where: { seasonId } });
  const numTeams = seasonTeams.length;
  if (numTeams === 0) return [];
  
  const matches = await getAllMatches(seasonId);

  let effectiveNumTeams = numTeams;
  if (effectiveNumTeams % 2 !== 0) {
    effectiveNumTeams++;
  }

  const matchesPerMatchday = Math.max(1, Math.floor(effectiveNumTeams / 2));
  const totalMatchdays = matches.length > 0 ? Math.ceil(matches.length / matchesPerMatchday) : 0;


  const matchdays: Matchday[] = [];

  for (let i = 0; i < totalMatchdays; i++) {
    const startIndex = i * matchesPerMatchday;
    const endIndex = startIndex + matchesPerMatchday;
    matchdays.push({
      matchday: i + 1,
      matches: matches.slice(startIndex, endIndex) as unknown as MatchWithTeams[],
    });
  }

  return matchdays;
}

// Dummy types for compilation, since they are not in prisma schema anymore
export type MatchPlayer = {};
export type PlayerPosition = {};

    