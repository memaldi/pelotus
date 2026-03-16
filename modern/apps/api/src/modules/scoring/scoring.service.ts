import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

type MatchDayPointsInput = {
  userId: number;
  matchDayId: number;
  competitionId: number;
};

@Injectable()
export class ScoringService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserMatchDayPoints(input: MatchDayPointsInput) {
    const prisma = this.prisma as any;

    const bets = await prisma.bet.findMany({
      where: {
        userId: input.userId,
        matchDayId: input.matchDayId,
        competitionId: input.competitionId,
      },
      include: {
        match: true,
      },
    });

    const totalMatches = await prisma.match.count({
      where: { matchDayId: input.matchDayId },
    });

    let userPoints = 0;
    let matchedBets = 0;

    for (const bet of bets) {
      const betHasGoals = bet.homeGoals !== null && bet.foreignGoals !== null;
      const matchHasGoals = bet.match.homeGoals !== null && bet.match.foreignGoals !== null;

      if (!betHasGoals || !matchHasGoals) {
        continue;
      }

      const predictedSign = Math.sign(bet.homeGoals - bet.foreignGoals);
      const realSign = Math.sign(bet.match.homeGoals - bet.match.foreignGoals);

      if (predictedSign === realSign) {
        userPoints += 5;
        matchedBets += 1;
      }

      if (
        bet.homeGoals === bet.match.homeGoals &&
        bet.foreignGoals === bet.match.foreignGoals
      ) {
        userPoints += 3;
      }
    }

    if (matchedBets >= totalMatches && totalMatches > 0) {
      userPoints += 10;
    }

    const goalsBet = await prisma.goalsBet.findUnique({
      where: {
        userId_matchDayId: {
          userId: input.userId,
          matchDayId: input.matchDayId,
        },
      },
    });

    if (!goalsBet) {
      return userPoints;
    }

    if (goalsBet.forwardId) {
      const playerGoal = await prisma.playerGoal.findUnique({
        where: {
          playerId_matchDayId: {
            playerId: goalsBet.forwardId,
            matchDayId: input.matchDayId,
          },
        },
      });
      if (playerGoal) {
        userPoints += playerGoal.goals;
      }
    }

    if (goalsBet.midfieldId) {
      const playerGoal = await prisma.playerGoal.findUnique({
        where: {
          playerId_matchDayId: {
            playerId: goalsBet.midfieldId,
            matchDayId: input.matchDayId,
          },
        },
      });
      if (playerGoal) {
        userPoints += playerGoal.goals * 3;
      }
    }

    if (goalsBet.defenseId) {
      const playerGoal = await prisma.playerGoal.findUnique({
        where: {
          playerId_matchDayId: {
            playerId: goalsBet.defenseId,
            matchDayId: input.matchDayId,
          },
        },
      });
      if (playerGoal) {
        userPoints += playerGoal.goals * 5;
      }
    }

    return userPoints;
  }
}
