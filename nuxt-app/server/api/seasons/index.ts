import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const seasons = await prisma.season.findMany({ orderBy: { startDate: 'desc' } })
  return seasons
})