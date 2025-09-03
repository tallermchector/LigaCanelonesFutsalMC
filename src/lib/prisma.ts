import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

/**
 * Creates a new instance of the Prisma client with the accelerate extension.
 * This function is used to ensure that only one instance of the Prisma client is created.
 *
 * @returns {ReturnType<typeof prismaClientSingleton>} A new instance of the Prisma client.
 */
const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate())
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

/**
 * The Prisma client instance.
 * This is a singleton instance of the Prisma client that is used throughout the application.
 * In development, the same instance is reused to avoid creating too many connections to the database.
 * In production, a new instance is created for each request.
 * @see https://www.prisma.io/docs/guides/database/troubleshooting-orm/database-connections
 */
