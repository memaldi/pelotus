import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const players = await prisma.player.findMany({ orderBy: { name: 'asc' } })
  return players
})