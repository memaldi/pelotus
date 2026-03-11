import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.server) {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient()
  }
  prisma = globalThis.prisma
} else {
  // client-side should never use Prisma
  prisma = {} as PrismaClient
}

export default prisma
