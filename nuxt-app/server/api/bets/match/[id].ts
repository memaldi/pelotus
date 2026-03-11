import { PrismaClient } from '@prisma/client'
import { requireUser } from '../../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number((event.context.params as any).id)
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid match id' })

  const user = (event as any).context.user
  if (user) {
    // return only this user's bet
    const bet = await prisma.bet.findFirst({
      where: { matchId: id, userId: user.id }
    })
    return bet
  }
  // otherwise return all bets for match (maybe anonymized)
  const bets = await prisma.bet.findMany({
    where: { matchId: id },
    select: { homeGoals: true, awayGoals: true }
  })
  return bets
})