import { computeGlobalRanking } from '../../../utils/ranking'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export default defineEventHandler(async (event) => {
  const id = Number((event.context.params as any).id)
  if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'invalid id' })

  const keys = await redis.keys(`competition:*:global:user:*:points`)
  if (keys.length) {
    const ranking: Record<number, Record<number, number>> = {}
    for (const key of keys) {
      const parts = key.split(':')
      const compId = Number(parts[1])
      const userId = Number(parts[4])
      const pts = Number(await redis.get(key))
      ranking[compId] = ranking[compId] || {}
      ranking[compId][userId] = pts
    }
    return ranking
  }

  const ranking = await computeGlobalRanking(id)
  return ranking
})