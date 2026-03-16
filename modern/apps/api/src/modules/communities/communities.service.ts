import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  private get db() {
    return this.prisma as any;
  }

  private async ensureDefaultLeague() {
    const existingLeague = await this.db.league.findFirst({
      orderBy: { name: "asc" },
    });

    if (existingLeague) {
      return existingLeague;
    }

    return this.db.league.create({
      data: {
        name: "General",
        description: "Auto-created default league",
      },
    });
  }

  async list(query?: string) {
    const communities = await this.db.community.findMany({
      where: query
        ? {
            name: {
              contains: query,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { name: "asc" },
      take: 20,
    });

    return { communities };
  }

  private async getActiveSeason() {
    const now = new Date();
    const currentSeason = await this.db.season.findFirst({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: "desc" },
    });

    if (currentSeason) {
      return currentSeason;
    }

    const latestSeason = await this.db.season.findFirst({
      orderBy: { startDate: "desc" },
    });

    if (latestSeason) {
      return latestSeason;
    }

    // First-run bootstrap: create a default season so onboarding can continue
    // on an empty database.
    const league = await this.ensureDefaultLeague();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);

    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);

    return this.db.season.create({
      data: {
        leagueId: league.id,
        name: `Season ${now.getFullYear()}`,
        description: "Auto-created initial season",
        startDate,
        endDate,
      },
    });
  }

  async create(userId: number, name: string, description: string) {
    const existing = await this.db.community.findUnique({ where: { name } });
    if (existing) {
      throw new BadRequestException("Community name already exists");
    }

    const season = await this.getActiveSeason();
    const community = await this.db.community.create({
      data: { name, description },
    });

    const competition = await this.db.competition.create({
      data: {
        communityId: community.id,
        seasonId: season.id,
      },
    });

    await this.db.userAdministration.upsert({
      where: {
        userId_competitionId: {
          userId,
          competitionId: competition.id,
        },
      },
      create: {
        userId,
        competitionId: competition.id,
        isAdmin: true,
      },
      update: {
        isAdmin: true,
      },
    });

    return { community, competition };
  }

  async join(communityId: number, userId: number) {
    const season = await this.getActiveSeason();
    const competition = await this.db.competition.findFirst({
      where: {
        communityId,
        seasonId: season.id,
      },
      include: {
        community: true,
      },
    });

    if (!competition) {
      throw new NotFoundException("No current competition exists for this community");
    }

    await this.db.userAdministration.upsert({
      where: {
        userId_competitionId: {
          userId,
          competitionId: competition.id,
        },
      },
      create: {
        userId,
        competitionId: competition.id,
        isAdmin: false,
      },
      update: {},
    });

    return { competition };
  }
}
