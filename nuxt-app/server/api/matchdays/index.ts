import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 50
  const days = await prisma.matchDay.findMany({
    take: limit,
    orderBy: { date: 'asc' }
  })
  return days
})