import { PrismaClient } from '@prisma/client'
import { requireUser } from '../../../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number((event.context.params as any).id)
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'invalid matchDay id' })

  const user = (event as any).context.user
  if (user) {
    const bet = await prisma.goalsBet.findFirst({
      where: { matchDayId: id, userId: user.id }
    })
    return bet
  }
  // return public data -- only player ids to avoid spoilers?
  const bets = await prisma.goalsBet.findMany({
    where: { matchDayId: id },
    select: { forwardId: true, midfieldId: true, defenseId: true }
  })
  return bets
})