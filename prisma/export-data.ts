
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data export...');

  const exportDir = path.join(__dirname, 'json-exports');

  try {
    await fs.mkdir(exportDir, { recursive: true });
    console.log(`Export directory created at: ${exportDir}`);
  } catch (error) {
    console.error('Failed to create export directory:', error);
    return;
  }

  const modelNames = ['team', 'player', 'match', 'gameEvent'] as const;

  for (const modelName of modelNames) {
    try {
      // Access the model delegate dynamically
      const delegate = prisma[modelName as keyof typeof prisma] as any;
      
      if (typeof delegate?.findMany !== 'function') {
        console.warn(`Model '${modelName}' does not have a findMany method. Skipping.`);
        continue;
      }

      console.log(`Fetching data for ${modelName}...`);
      const records = await delegate.findMany();
      
      const filePath = path.join(exportDir, `${modelName}s.json`);
      await fs.writeFile(filePath, JSON.stringify(records, null, 2));
      
      console.log(`Successfully exported ${records.length} records to ${filePath}`);

    } catch (error) {
      console.error(`Failed to export data for model '${modelName}':`, error);
    }
  }

  console.log('Data export finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
