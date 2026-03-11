import { PrismaClient } from '@prisma/client'
import { requireUser } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)
  const {
    competitionId,
    winterChampionId,
    kingsCupChampionId,
    leagueChampionId,
    uefaChampionId,
    championsLeagueChampId,
    bestGoalkeeperId,
    championsPositionsIds,
    uefaPositionsIds,
    demotionPositionsIds
  } = body as any

  if (!competitionId) {
    throw createError({ statusCode: 400, statusMessage: 'competitionId required' })
  }

  const bet = await prisma.globalBet.upsert({
    where: { userId_competitionId: { userId: user.id, competitionId } },
    update: {
      winterChampionId,
      kingsCupChampionId,
      leagueChampionId,
      uefaChampionId,
      championsLeagueChampId,
      bestGoalkeeperId,
      championsPositions: { set: championsPositionsIds || [] },
      uefaPositions: { set: uefaPositionsIds || [] },
      demotionPositions: { set: demotionPositionsIds || [] }
    },
    create: {
      userId: user.id,
      competitionId,
      winterChampionId,
      kingsCupChampionId,
      leagueChampionId,
      uefaChampionId,
      championsLeagueChampId,
      bestGoalkeeperId,
      championsPositions: { connect: championsPositionsIds?.map((id: number) => ({ id })) || [] },
      uefaPositions: { connect: uefaPositionsIds?.map((id: number) => ({ id })) || [] },
      demotionPositions: { connect: demotionPositionsIds?.map((id: number) => ({ id })) || [] }
    }
  })

  return bet
})