import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const seasonId = query.seasonId ? Number(query.seasonId) : undefined
  const where: any = {}
  if (seasonId && !isNaN(seasonId)) where.seasonId = seasonId
  const comps = await prisma.competition.findMany({ where })
  return comps
})