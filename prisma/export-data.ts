import { Prisma, PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Convierte un string de PascalCase a camelCase.
 * Ejemplo: "PlayerMatchStats" se convierte en "playerMatchStats".
 * @param str El string a convertir.
 * @returns El string en camelCase.
 */
function toCamelCase(str: string): string {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
}

async function main() {
  console.log('🔵 Iniciando la exportación de datos...');

  const exportDir = path.join(__dirname, 'json-exports');

  // 1. Crear el directorio de exportación si no existe
  try {
    await fs.mkdir(exportDir, { recursive: true });
    console.log(`📂 Directorio de exportación asegurado en: ${exportDir}`);
  } catch (error) {
    console.error('🔴 Error al crear el directorio de exportación:', error);
    return; // Detener si no se puede crear el directorio
  }

  // 2. Obtener dinámicamente todos los nombres de los modelos del schema de Prisma
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);
  console.log(`🔍 Modelos encontrados en el schema: ${modelNames.join(', ')}`);

  // 3. Iterar sobre cada modelo y exportar sus datos
  for (const modelName of modelNames) {
    const delegateName = toCamelCase(modelName);
    
    try {
      // Acceder al delegado del modelo dinámicamente (ej: prisma.team, prisma.player)
      const delegate = prisma[delegateName as keyof typeof prisma] as any;
      
      if (typeof delegate?.findMany !== 'function') {
        console.warn(`🟡 El modelo '${modelName}' no tiene un método findMany. Omitiendo.`);
        continue;
      }

      console.log(`[${delegateName}] -> Obteniendo datos...`);
      const records = await delegate.findMany();
      
      const filePath = path.join(exportDir, `${delegateName}.json`);
      // Usamos JSON.stringify con indentación para que el archivo sea legible
      await fs.writeFile(filePath, JSON.stringify(records, null, 2));
      
      console.log(`[${delegateName}] -> ✅ Exportados ${records.length} registros a ${filePath}`);

    } catch (error) {
      console.error(`🔴 Error al exportar el modelo '${modelName}':`, error);
    }
  }

  console.log('🟢 Exportación de datos finalizada.');
}

main()
  .catch((e) => {
    console.error('🔴 Ocurrió un error fatal durante la exportación:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Asegurarse de cerrar la conexión a la base de datos
    await prisma.$disconnect();
  });