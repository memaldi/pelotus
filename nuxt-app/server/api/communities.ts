import { PrismaClient } from '@prisma/client'
import { requireUser } from '../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const slug = (event.context.params as any)?.slug
  if (event.req.method === 'GET') {
    if (slug) {
      const comm = await prisma.community.findUnique({
        where: { slug },
        include: { competitions: true }
      })
      if (!comm) throw createError({ statusCode: 404, statusMessage: 'Community not found' })
      return comm
    }
    const communities = await prisma.community.findMany({
      take: 50
    })
    return communities
  }
  if (event.req.method === 'POST' && slug) {
    const user = requireUser(event)
    const comm = await prisma.community.findUnique({ where: { slug } })
    if (!comm) throw createError({ statusCode: 404, statusMessage: 'Community not found' })
    // join first competition for now
    const comp = await prisma.competition.findFirst({ where: { communityId: comm.id } })
    if (!comp) throw createError({ statusCode: 400, statusMessage: 'No competition available' })
    const membership = await prisma.competitionMembership.create({
      data: { userId: user.id, competitionId: comp.id }
    })
    return membership
  }
  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})