import { PrismaClient } from '@prisma/client';
import { futsalTeams } from '../src/data/teams';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  console.log('Cleared previous data.');

  for (const team of futsalTeams) {
    const createdTeam = await prisma.team.create({
      data: {
        id: team.id,
        name: team.name,
        logoUrl: team.logoUrl,
        players: {
          create: team.players.map(player => ({
            id: player.id,
            name: player.name,
            number: player.number,
            position: player.position,
          })),
        },
      },
      include: {
        players: true,
      },
    });
    console.log(`Created team with id: ${createdTeam.id} and ${createdTeam.players.length} players`);
  }
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
