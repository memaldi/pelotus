import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import { computeMatchDayRanking } from '../../utils/ranking'

const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { matchDayId } = body as { matchDayId: number }
  if (!matchDayId) throw createError({ statusCode: 400, statusMessage: 'matchDayId required' })

  // enqueue a message for the worker to process later
  await redis.publish(
    'task:matchday',
    JSON.stringify({ matchDayId })
  )

  return { ok: true, queued: true }
})