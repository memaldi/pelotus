import { PrismaClient } from '@prisma/client'
import { requireUser } from '../../../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = Number((event.context.params as any).id)
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'invalid competition id' })

  const user = (event as any).context.user
  if (user) {
    const bet = await prisma.globalBet.findFirst({
      where: { competitionId: id, userId: user.id }
    })
    return bet
  }
  const bets = await prisma.globalBet.findMany({
    where: { competitionId: id },
    select: {
      winterChampionId: true,
      kingsCupChampionId: true,
      leagueChampionId: true,
      uefaChampionId: true,
      championsLeagueChampId: true,
      bestGoalkeeperId: true,
      championsPositions: true,
      uefaPositions: true,
      demotionPositions: true
    }
  })
  return bets
})