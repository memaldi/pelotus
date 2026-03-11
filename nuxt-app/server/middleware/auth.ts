import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET || 'supersecret'

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, 'authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return
  }
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, SECRET) as any
    if (payload && payload.sub) {
      const user = await prisma.user.findUnique({ where: { id: payload.sub } })
      if (user) {
        // attach user to event context
        (event as any).context.user = user
      }
    }
  } catch (err) {
    // invalid token: ignore
  }
})