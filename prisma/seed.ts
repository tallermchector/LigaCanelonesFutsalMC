import { PrismaClient } from '@prisma/client';
import { futsalTeams } from '../src/data/teams';
import { players } from '../src/data/players';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  console.log('Cleared previous data.');

  // Seed Teams
  for (const team of futsalTeams) {
    await prisma.team.create({
      data: {
        id: team.id,
        name: team.name,
        logoUrl: team.logoUrl,
        slug: team.slug,
      },
    });
    console.log(`Created team: ${team.name}`);
  }

  // Seed Players
  for (const player of players) {
    await prisma.player.create({
      data: {
        id: player.id,
        name: player.name,
        number: player.number,
        position: player.position,
        birthDate: player.birthDate,
        height: player.height,
        weight: player.weight,
        nationality: player.nationality,
        teamId: player.teamId,
      },
    });
  }
  console.log(`Created ${players.length} players.`);

  console.log(`Seeding finished.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
