import { BadRequestException, Injectable } from "@nestjs/common";
import { PlayerPosition } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const POSITION_MAP: Record<string, PlayerPosition> = {
  GK: PlayerPosition.GK,
  DF: PlayerPosition.DF,
  MF: PlayerPosition.MF,
  FW: PlayerPosition.FW,
};

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlayersByTeamPosition(teamId: number, seasonId: number, position: string) {
    const prisma = this.prisma as any;
    const normalizedPosition = position.toUpperCase();
    const prismaPosition = POSITION_MAP[normalizedPosition];

    if (!prismaPosition) {
      throw new BadRequestException("Position must be one of GK, DF, MF, FW");
    }

    const teamInSeason = await prisma.teamInSeason.findUnique({
      where: {
        teamId_seasonId: {
          teamId,
          seasonId,
        },
      },
      select: { id: true },
    });

    if (!teamInSeason) {
      return [];
    }

    const players = await prisma.playerBelongsToTeam.findMany({
      where: {
        teamInSeasonId: teamInSeason.id,
        position: prismaPosition,
      },
      select: {
        player: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        player: {
          name: "asc",
        },
      },
    });

    return players.map((entry: { player: { id: number; name: string } }) => entry.player);
  }
}
