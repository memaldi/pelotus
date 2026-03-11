import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// For simplicity we don't enforce an admin check here yet.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    seasonId,
    deadline,
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

  if (!seasonId || !deadline) {
    throw createError({ statusCode: 400, statusMessage: 'seasonId and deadline required' })
  }

  const results = await prisma.globalResults.create({
    data: {
      seasonId,
      deadline: new Date(deadline),
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
  return results
})