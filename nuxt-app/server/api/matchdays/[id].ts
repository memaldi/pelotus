import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number((event.context.params as any).id)
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  const day = await prisma.matchDay.findUnique({
    where: { id },
    include: { matches: true }
  })
  if (!day) throw createError({ statusCode: 404, statusMessage: 'MatchDay not found' })
  return day
})