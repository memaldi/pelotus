import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number((event.context.params as any).id)
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'invalid id' })
  const player = await prisma.player.findUnique({ where: { id } })
  if (!player) throw createError({ statusCode: 404, statusMessage: 'not found' })
  return player
})