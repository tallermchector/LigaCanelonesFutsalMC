
import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Definimos tipos para los datos que leeremos de los JSON.
// Esto nos da autocompletado y seguridad de tipos.
type TeamData = Prisma.TeamCreateInput;
type PlayerData = Prisma.PlayerCreateManyInput;

async function main() {
  console.log(`🔵 Iniciando el proceso de seeding...`);

  // 1. Limpieza de la base de datos en el orden correcto
  // ----------------------------------------------------
  // Se eliminan primero los modelos con claves foráneas.
  console.log(`🧹 Limpiando la base de datos...`);
  await prisma.playerMatchStats.deleteMany();
  await prisma.gameEvent.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.seasonTeam.deleteMany();
  await prisma.team.deleteMany();
  await prisma.season.deleteMany();
  console.log('-> ✅ Base de datos limpia.');

  // 2. Leer y parsear los archivos JSON
  // ----------------------------------------------------
  console.log('📂 Leyendo archivos JSON...');
  const teamsPath = path.join(__dirname, 'json-exports', 'teams.json');
  const playersPath = path.join(__dirname, 'json-exports', 'players.json');

  const teamsFile = fs.readFileSync(teamsPath, 'utf-8');
  const playersFile = fs.readFileSync(playersPath, 'utf-8');

  const teamsData: TeamData[] = JSON.parse(teamsFile);
  const playersData: PlayerData[] = JSON.parse(playersFile);
  console.log(`-> ✅ Encontrados ${teamsData.length} equipos y ${playersData.length} jugadores.`);

  // 3. Inserción de los datos usando createMany para eficiencia
  // ----------------------------------------------------
  console.log(`🌱 Sembrando los datos...`);
  
  // Insertar Equipos
  // Usamos `skipDuplicates: true` por si acaso, aunque la limpieza debería prevenirlo.
  await prisma.team.createMany({
    data: teamsData,
    skipDuplicates: true,
  });
  console.log(`-> ✅ ${teamsData.length} equipos creados.`);

  // Insertar Jugadores
  await prisma.player.createMany({
    data: playersData,
    skipDuplicates: true,
  });
  console.log(`-> ✅ ${playersData.length} jugadores creados.`);

  console.log(`🟢 Seeding finalizado exitosamente.`);
}

main()
  .catch((e) => {
    console.error('🔴 Error durante el proceso de seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Asegurarse de cerrar la conexión a la base de datos
    await prisma.$disconnect();
  });
