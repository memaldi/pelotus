import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// data structure for the ranking result
export interface CompetitionUserPoints {
  [competitionId: number]: { [userId: number]: number }
}

export async function computeMatchDayRanking(matchDayId: number): Promise<CompetitionUserPoints> {
  const matchDay = await prisma.matchDay.findUnique({
    where: { id: matchDayId },
    include: { matches: true }
  })
  if (!matchDay) {
    throw new Error(`MatchDay ${matchDayId} not found`)
  }

  const competitions = await prisma.competition.findMany({
    where: { seasonId: matchDay.seasonId },
    include: { memberships: { include: { user: true } } }
  })

  const ranking: CompetitionUserPoints = {}
  const totalBet = matchDay.matches.length

  for (const comp of competitions) {
    ranking[comp.id] = {}
    for (const membership of comp.memberships) {
      const uid = membership.userId
      const points = await getUserMatchDayPoints(uid, matchDayId, comp.id, totalBet)
      ranking[comp.id][uid] = points
    }
  }

  return ranking
}

export async function getUserMatchDayPoints(
  userId: number,
  matchDayId: number,
  competitionId: number,
  totalBet: number
): Promise<number> {
  let userPoints = 0
  let matchedBets = 0

  const bets = await prisma.bet.findMany({
    where: { userId, matchDayId, competitionId },
    include: { match: true }
  })

  for (const bet of bets) {
    const bHome = bet.homeGoals
    const bAway = bet.awayGoals
    const m = bet.match

    if (
      bHome != null &&
      bAway != null &&
      m.homeGoals != null &&
      m.awayGoals != null
    ) {
      const outcomeCorrect =
        (bHome > bAway && m.homeGoals > m.awayGoals) ||
        (bHome < bAway && m.homeGoals < m.awayGoals) ||
        (bHome === bAway && m.homeGoals === m.awayGoals)

      if (outcomeCorrect) {
        userPoints += 5
        matchedBets += 1
      }

      if (bHome === m.homeGoals && bAway === m.awayGoals) {
        // extra points for exact score
        userPoints += 3
      }
    }
  }

  if (matchedBets >= totalBet && totalBet > 0) {
    userPoints += 10
  }

  // goals bet bonus -- look up the user's selected players and add
  // the corresponding number of goals from the PlayerGoal table.  The
  // original Django code multiplied midfield goals by 3 and defense
  // goals by 5.
  const goalsBet = await prisma.goalsBet.findFirst({ where: { userId, matchDayId } })
  if (goalsBet) {
    if (goalsBet.forwardId) {
      const pg = await prisma.playerGoal.findFirst({
        where: { matchDayId, playerId: goalsBet.forwardId }
      })
      if (pg) {
        userPoints += pg.goals
      }
    }
    if (goalsBet.midfieldId) {
      const pg = await prisma.playerGoal.findFirst({
        where: { matchDayId, playerId: goalsBet.midfieldId }
      })
      if (pg) {
        userPoints += pg.goals * 3
      }
    }
    if (goalsBet.defenseId) {
      const pg = await prisma.playerGoal.findFirst({
        where: { matchDayId, playerId: goalsBet.defenseId }
      })
      if (pg) {
        userPoints += pg.goals * 5
      }
    }
  }

  return userPoints
}

export async function computeGlobalRanking(
  globalResultsId: number
): Promise<CompetitionUserPoints> {
  const results = await prisma.globalResults.findUnique({
    where: { id: globalResultsId },
    include: {
      championsPositions: true,
      uefaPositions: true,
      demotionPositions: true
    }
  })

  if (!results) {
    throw new Error(`GlobalResults ${globalResultsId} not found`)
  }

  const competitions = await prisma.competition.findMany({
    where: { seasonId: results.seasonId }
  })

  const ranking: CompetitionUserPoints = {}

  for (const comp of competitions) {
    ranking[comp.id] = {}
    const bets = await prisma.globalBet.findMany({
      where: { competitionId: comp.id },
      include: {
        championsPositions: true,
        uefaPositions: true,
        demotionPositions: true
      }
    })

    for (const bet of bets) {
      const pts = getUserGlobalPoints(bet, results)
      ranking[comp.id][bet.userId] = pts
    }
  }

  return ranking
}

export function getUserGlobalPoints(bet: any, results: any): number {
  if (!bet) return 0
  let pts = 0

  if (bet.winterChampionId && results.winterChampionId === bet.winterChampionId) {
    pts += 10
  }
  if (bet.kingsCupChampionId && results.kingsCupChampionId === bet.kingsCupChampionId) {
    pts += 10
  }
  if (bet.leagueChampionId && results.leagueChampionId === bet.leagueChampionId) {
    pts += 10
  }
  if (bet.uefaChampionId && results.uefaChampionId === bet.uefaChampionId) {
    pts += 10
  }
  if (
    bet.championsLeagueChampId &&
    results.championsLeagueChampId === bet.championsLeagueChampId
  ) {
    pts += 10
  }

  // position lists
  if (bet.championsPositions && results.championsPositions) {
    for (const team of bet.championsPositions) {
      if (results.championsPositions.some((t: any) => t.id === team.id)) {
        pts += 10
      }
    }
  }
  if (bet.uefaPositions && results.uefaPositions) {
    for (const team of bet.uefaPositions) {
      if (results.uefaPositions.some((t: any) => t.id === team.id)) {
        pts += 10
      }
    }
  }
  if (bet.demotionPositions && results.demotionPositions) {
    for (const team of bet.demotionPositions) {
      if (results.demotionPositions.some((t: any) => t.id === team.id)) {
        pts += 10
      }
    }
  }

  if (
    bet.bestGoalkeeperId &&
    results.bestGoalkeeperId === bet.bestGoalkeeperId
  ) {
    pts += 10
  }

  return pts
}
