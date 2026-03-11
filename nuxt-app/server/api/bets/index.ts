import { PrismaClient } from '@prisma/client'
import { requireUser } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  const { matchId, matchDayId, homeGoals, awayGoals } = body as any
  if (!matchId || !matchDayId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing identifiers' })
  }
  const bet = await prisma.bet.upsert({
    where: {
      userId_matchId: {
        userId: user.id,
        matchId: matchId
      }
    },
    update: {
      homeGoals,
      awayGoals
    },
    create: {
      userId: user.id,
      matchId,
      matchDayId,
      homeGoals,
      awayGoals
    }
  })
  return bet
})