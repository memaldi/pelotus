import { describe, it, expect } from 'vitest'
import { getUserGlobalPoints } from '../server/utils/ranking'

// helper to build simple objects
function makeBet(overrides: any = {}) {
  return {
    winterChampionId: null,
    kingsCupChampionId: null,
    leagueChampionId: null,
    uefaChampionId: null,
    championsLeagueChampId: null,
    bestGoalkeeperId: null,
    championsPositions: [],
    uefaPositions: [],
    demotionPositions: [],
    ...overrides
  }
}

function makeResults(overrides: any = {}) {
  return {
    winterChampionId: null,
    kingsCupChampionId: null,
    leagueChampionId: null,
    uefaChampionId: null,
    championsLeagueChampId: null,
    bestGoalkeeperId: null,
    championsPositions: [],
    uefaPositions: [],
    demotionPositions: [],
    ...overrides
  }
}

describe('getUserGlobalPoints', () => {
  it('returns 0 when bet is null', () => {
    expect(getUserGlobalPoints(null as any, makeResults())).toBe(0)
  })

  it('awards 10 points for each correct simple prediction', () => {
    const bet = makeBet({ winterChampionId: 1, leagueChampionId: 2 })
    const results = makeResults({ winterChampionId: 1, leagueChampionId: 99 })
    expect(getUserGlobalPoints(bet, results)).toBe(10)
  })

  it('awards points for matching positions', () => {
    const bet = makeBet({ championsPositions: [{ id: 1 }, { id: 2 }] })
    const results = makeResults({ championsPositions: [{ id: 2 }, { id: 3 }] })
    expect(getUserGlobalPoints(bet, results)).toBe(10)
  })

  it('counts goalkeeper and other categories', () => {
    const bet = makeBet({ bestGoalkeeperId: 5 })
    const results = makeResults({ bestGoalkeeperId: 5 })
    expect(getUserGlobalPoints(bet, results)).toBe(10)
  })
})