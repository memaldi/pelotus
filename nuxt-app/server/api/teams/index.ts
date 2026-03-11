import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const teams = await prisma.team.findMany({ orderBy: { name: 'asc' } })
  return teams
})