import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET || 'supersecret'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body as { email: string; password: string }
  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  }
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }
  const token = jwt.sign({ sub: user.id, email: user.email }, SECRET, {
    expiresIn: '7d'
  })
  return { token }
})