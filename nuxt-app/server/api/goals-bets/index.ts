import { PrismaClient } from '@prisma/client'
import { requireUser } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  const { matchDayId, forwardId, midfieldId, defenseId } = body as any
  if (!matchDayId) {
    throw createError({ statusCode: 400, statusMessage: 'matchDayId required' })
  }

  const bet = await prisma.goalsBet.upsert({
    where: { userId_matchDayId: { userId: user.id, matchDayId } },
    update: { forwardId, midfieldId, defenseId },
    create: { userId: user.id, matchDayId, forwardId, midfieldId, defenseId }
  })
  return bet
})