import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // add initial data: communities, seasons, teams, match days
  const community = await prisma.community.create({ data: { name: 'General', slug: 'general' }})
  const season = await prisma.season.create({ data: { name: '2025/26', startDate: new Date(), endDate: new Date() }})
  const comp = await prisma.competition.create({ data: { communityId: community.id, seasonId: season.id }})
  console.log('Seed complete')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => await prisma.$disconnect())
