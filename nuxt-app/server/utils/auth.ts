import { H3Event } from 'h3'

export function requireUser(event: H3Event) {
  const ctx: any = event.context
  if (!ctx.user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }
  return ctx.user
}
