import { PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import { computeGlobalRanking } from '../../utils/ranking'

const prisma = new PrismaClient()
const redis = new Redis(process.env.REDIS_URL)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { globalResultsId } = body as { globalResultsId: number }
  if (!globalResultsId) throw createError({ statusCode: 400, statusMessage: 'globalResultsId required' })

  // publish job for background worker
  await redis.publish(
    'task:global',
    JSON.stringify({ globalResultsId })
  )
  return { ok: true, queued: true }
})