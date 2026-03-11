import Redis from 'ioredis'
import { computeMatchDayRanking, computeGlobalRanking } from './server/utils/ranking'

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379'
const redis = new Redis(redisUrl)
const ttl = 60 * 60 * 24 * 3

redis.subscribe('task:matchday', 'task:global')
console.log('worker subscribed to task channels')

redis.on('message', async (channel: string, msg: string) => {
  try {
    const data = JSON.parse(msg)
    if (channel === 'task:matchday') {
      const { matchDayId } = data
      console.log('processing match day', matchDayId)
      const ranking = await computeMatchDayRanking(matchDayId)
      for (const compId of Object.keys(ranking)) {
        const users = ranking[Number(compId)]
        for (const userId of Object.keys(users)) {
          const pts = users[Number(userId)]
          const key = `competition:${compId}:match_day:${matchDayId}:user:${userId}:points`
          await redis.set(key, pts.toString(), 'EX', ttl)
        }
      }
    } else if (channel === 'task:global') {
      const { globalResultsId } = data
      console.log('processing global results', globalResultsId)
      const ranking = await computeGlobalRanking(globalResultsId)
      for (const compId of Object.keys(ranking)) {
        const users = ranking[Number(compId)]
        for (const userId of Object.keys(users)) {
          const pts = users[Number(userId)]
          const key = `competition:${compId}:global:user:${userId}:points`
          await redis.set(key, pts.toString(), 'EX', ttl)
        }
      }
    }
  } catch (err) {
    console.error('worker error processing message', err)
  }
})

// keep the process alive
process.stdin.resume()
