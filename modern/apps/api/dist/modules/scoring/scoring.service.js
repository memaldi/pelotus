"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ScoringService = class ScoringService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserMatchDayPoints(input) {
        const prisma = this.prisma;
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
            if (bet.homeGoals === bet.match.homeGoals &&
                bet.foreignGoals === bet.match.foreignGoals) {
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
};
exports.ScoringService = ScoringService;
exports.ScoringService = ScoringService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScoringService);
//# sourceMappingURL=scoring.service.js.map