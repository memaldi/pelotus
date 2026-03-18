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
exports.CompetitionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const scoring_service_1 = require("../scoring/scoring.service");
let CompetitionsService = class CompetitionsService {
    constructor(prisma, scoringService) {
        this.prisma = prisma;
        this.scoringService = scoringService;
    }
    get db() {
        return this.prisma;
    }
    formatSeasonLabel(season) {
        return season.league ? `${season.league.name} / ${season.name}` : season.name;
    }
    async getMyCompetitions(userId) {
        const administrations = await this.db.userAdministration.findMany({
            where: { userId },
            include: {
                competition: {
                    include: {
                        community: true,
                        season: { include: { league: true } },
                    },
                },
            },
            orderBy: { id: "asc" },
        });
        return {
            competitions: administrations.map((a) => ({
                id: a.competition.id,
                communityName: a.competition.community.name,
                seasonName: this.formatSeasonLabel(a.competition.season),
                isAdmin: a.isAdmin,
            })),
        };
    }
    async getCompetitionOrThrow(competitionId) {
        const competition = await this.db.competition.findUnique({
            where: { id: competitionId },
            include: {
                season: { include: { league: true } },
                community: true,
            },
        });
        if (!competition) {
            throw new common_1.NotFoundException(`Competition ${competitionId} not found`);
        }
        return competition;
    }
    async getMatchDays(competitionId) {
        const competition = await this.getCompetitionOrThrow(competitionId);
        const matchDays = await this.db.matchDay.findMany({
            where: { seasonId: competition.seasonId },
            include: {
                _count: {
                    select: { matches: true },
                },
            },
            orderBy: { number: "asc" },
        });
        return {
            competition: {
                id: competition.id,
                communityName: competition.community.name,
                seasonName: this.formatSeasonLabel(competition.season),
            },
            matchDays: matchDays.map((md) => ({
                id: md.id,
                number: md.number,
                startDate: md.startDate,
                matchCount: md._count.matches,
            })),
        };
    }
    async getMatchDay(competitionId, matchDayId, userId) {
        await this.getCompetitionOrThrow(competitionId);
        const matchDay = await this.db.matchDay.findUnique({
            where: { id: matchDayId },
            include: {
                matches: {
                    include: {
                        homeTeam: true,
                        foreignTeam: true,
                    },
                    orderBy: {
                        homeTeam: {
                            name: "asc",
                        },
                    },
                },
            },
        });
        if (!matchDay) {
            throw new common_1.NotFoundException(`MatchDay ${matchDayId} not found`);
        }
        const bets = await Promise.all(matchDay.matches.map(async (match) => {
            const bet = await this.db.bet.upsert({
                where: {
                    userId_matchId_competitionId: {
                        userId,
                        matchId: match.id,
                        competitionId,
                    },
                },
                update: {},
                create: {
                    userId,
                    matchId: match.id,
                    matchDayId,
                    competitionId,
                },
            });
            return {
                betId: bet.id,
                matchId: match.id,
                homeTeam: match.homeTeam.name,
                foreignTeam: match.foreignTeam.name,
                realResult: {
                    homeGoals: match.homeGoals,
                    foreignGoals: match.foreignGoals,
                },
                userBet: {
                    homeGoals: bet.homeGoals,
                    foreignGoals: bet.foreignGoals,
                },
            };
        }));
        return {
            matchDay: {
                id: matchDay.id,
                number: matchDay.number,
                startDate: matchDay.startDate,
            },
            bets,
        };
    }
    async upsertMatchDayBets(competitionId, matchDayId, payload, userId) {
        await this.getCompetitionOrThrow(competitionId);
        for (const bet of payload.bets) {
            await this.db.bet.upsert({
                where: {
                    userId_matchId_competitionId: {
                        userId,
                        matchId: bet.matchId,
                        competitionId,
                    },
                },
                create: {
                    userId,
                    competitionId,
                    matchDayId,
                    matchId: bet.matchId,
                    homeGoals: bet.homeGoals,
                    foreignGoals: bet.foreignGoals,
                },
                update: {
                    homeGoals: bet.homeGoals,
                    foreignGoals: bet.foreignGoals,
                },
            });
        }
        return this.getMatchDay(competitionId, matchDayId, userId);
    }
    async getScorers(competitionId, matchDayId, userId) {
        const competition = await this.getCompetitionOrThrow(competitionId);
        const goalsBet = await this.db.goalsBet.findUnique({
            where: {
                userId_matchDayId: {
                    userId,
                    matchDayId,
                },
            },
            include: {
                defense: true,
                midfield: true,
                forward: true,
            },
        });
        const teams = await this.db.teamInSeason.findMany({
            where: {
                seasonId: competition.seasonId,
                spanishLeague: true,
            },
            include: {
                team: true,
            },
            orderBy: {
                team: {
                    name: "asc",
                },
            },
        });
        const [defenders, midfielders, forwards] = await Promise.all([
            this.db.playerBelongsToTeam.findMany({
                where: { seasonId: competition.seasonId, position: "DF" },
                include: { player: true },
                orderBy: { player: { name: "asc" } },
            }),
            this.db.playerBelongsToTeam.findMany({
                where: { seasonId: competition.seasonId, position: "MF" },
                include: { player: true },
                orderBy: { player: { name: "asc" } },
            }),
            this.db.playerBelongsToTeam.findMany({
                where: { seasonId: competition.seasonId, position: "FW" },
                include: { player: true },
                orderBy: { player: { name: "asc" } },
            }),
        ]);
        return {
            teams: teams.map((t) => ({ id: t.team.id, name: t.team.name })),
            candidates: {
                defenders: defenders.map((entry) => ({ id: entry.player.id, name: entry.player.name })),
                midfielders: midfielders.map((entry) => ({ id: entry.player.id, name: entry.player.name })),
                forwards: forwards.map((entry) => ({ id: entry.player.id, name: entry.player.name })),
            },
            goalsBet: goalsBet
                ? {
                    forwardId: goalsBet.forwardId,
                    midfieldId: goalsBet.midfieldId,
                    defenseId: goalsBet.defenseId,
                    forwardName: goalsBet.forward?.name ?? null,
                    midfieldName: goalsBet.midfield?.name ?? null,
                    defenseName: goalsBet.defense?.name ?? null,
                }
                : null,
        };
    }
    async upsertScorers(competitionId, matchDayId, payload, userId) {
        await this.getCompetitionOrThrow(competitionId);
        await this.db.goalsBet.upsert({
            where: {
                userId_matchDayId: {
                    userId,
                    matchDayId,
                },
            },
            create: {
                userId,
                matchDayId,
                forwardId: payload.forwardId,
                midfieldId: payload.midfieldId,
                defenseId: payload.defenseId,
            },
            update: {
                forwardId: payload.forwardId,
                midfieldId: payload.midfieldId,
                defenseId: payload.defenseId,
            },
        });
        return this.getScorers(competitionId, matchDayId, userId);
    }
    async getGlobalBets(competitionId, userId) {
        const competition = await this.getCompetitionOrThrow(competitionId);
        const teamBuckets = await Promise.all([
            this.db.teamInSeason.findMany({
                where: { seasonId: competition.seasonId, spanishLeague: true },
                include: { team: true },
                orderBy: { team: { name: "asc" } },
            }),
            this.db.teamInSeason.findMany({
                where: { seasonId: competition.seasonId, kingsCup: true },
                include: { team: true },
                orderBy: { team: { name: "asc" } },
            }),
            this.db.teamInSeason.findMany({
                where: { seasonId: competition.seasonId, uefaLeague: true },
                include: { team: true },
                orderBy: { team: { name: "asc" } },
            }),
            this.db.teamInSeason.findMany({
                where: { seasonId: competition.seasonId, championsLeague: true },
                include: { team: true },
                orderBy: { team: { name: "asc" } },
            }),
        ]);
        const goalkeepers = await this.db.playerBelongsToTeam.findMany({
            where: {
                seasonId: competition.seasonId,
                position: "GK",
            },
            include: { player: true },
            orderBy: { player: { name: "asc" } },
        });
        const globalResult = await this.db.globalResults.findFirst({
            where: { seasonId: competition.seasonId },
            include: {
                winterChampion: true,
                kingsCupChampion: true,
                leagueChampion: true,
                uefaChampion: true,
                championsLeagueChampion: true,
            },
            orderBy: { deadline: "desc" },
        });
        const globalBet = await this.db.globalBet.findUnique({
            where: {
                userId_competitionId: {
                    userId,
                    competitionId,
                },
            },
            include: {
                championsPositions: true,
                uefaPositions: true,
                demotionPositions: true,
            },
        });
        const allGlobalBets = await this.db.globalBet.findMany({
            where: { competitionId },
            include: {
                winterChampion: true,
                leagueChampion: true,
                uefaChampion: true,
                kingsCupChampion: true,
                championsLeagueChampion: true,
            },
        });
        const charts = {
            winterChampion: this.buildCountChart(allGlobalBets, "winterChampion"),
            leagueChampion: this.buildCountChart(allGlobalBets, "leagueChampion"),
            uefaChampion: this.buildCountChart(allGlobalBets, "uefaChampion"),
            kingsCupChampion: this.buildCountChart(allGlobalBets, "kingsCupChampion"),
            championsLeagueChampion: this.buildCountChart(allGlobalBets, "championsLeagueChampion"),
        };
        return {
            globalResult,
            globalBet,
            charts,
            teams: {
                spanishLeague: teamBuckets[0].map((t) => t.team),
                kingsCup: teamBuckets[1].map((t) => t.team),
                uefa: teamBuckets[2].map((t) => t.team),
                champions: teamBuckets[3].map((t) => t.team),
            },
            goalkeepers: goalkeepers.map((gk) => gk.player),
        };
    }
    buildCountChart(list, key) {
        const counts = {};
        for (const item of list) {
            const team = item[key];
            if (!team) {
                continue;
            }
            counts[team.name] = (counts[team.name] ?? 0) + 1;
        }
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }
    async upsertGlobalBets(competitionId, payload, userId) {
        await this.getCompetitionOrThrow(competitionId);
        await this.db.globalBet.upsert({
            where: {
                userId_competitionId: {
                    userId,
                    competitionId,
                },
            },
            create: {
                userId,
                competitionId,
                winterChampionId: payload.winterChampionId,
                kingsCupChampionId: payload.kingsCupChampionId,
                leagueChampionId: payload.leagueChampionId,
                uefaChampionId: payload.uefaChampionId,
                championsLeagueChampionId: payload.championsLeagueChampionId,
                bestGoalkeeperId: payload.bestGoalkeeperId,
                championsPositions: {
                    connect: payload.championsPositionIds.map((id) => ({ id })),
                },
                uefaPositions: {
                    connect: payload.uefaPositionIds.map((id) => ({ id })),
                },
                demotionPositions: {
                    connect: payload.demotionPositionIds.map((id) => ({ id })),
                },
            },
            update: {
                winterChampionId: payload.winterChampionId,
                kingsCupChampionId: payload.kingsCupChampionId,
                leagueChampionId: payload.leagueChampionId,
                uefaChampionId: payload.uefaChampionId,
                championsLeagueChampionId: payload.championsLeagueChampionId,
                bestGoalkeeperId: payload.bestGoalkeeperId,
                championsPositions: {
                    set: payload.championsPositionIds.map((id) => ({ id })),
                },
                uefaPositions: {
                    set: payload.uefaPositionIds.map((id) => ({ id })),
                },
                demotionPositions: {
                    set: payload.demotionPositionIds.map((id) => ({ id })),
                },
            },
        });
        return this.getGlobalBets(competitionId, userId);
    }
    async getMatchDayRanking(competitionId, matchDayId) {
        await this.getCompetitionOrThrow(competitionId);
        const users = await this.db.userAdministration.findMany({
            where: { competitionId },
            include: { user: true },
        });
        const ranking = await Promise.all(users.map(async (ua) => {
            const points = await this.scoringService.getUserMatchDayPoints({
                competitionId,
                matchDayId,
                userId: ua.userId,
            });
            const bets = await this.db.bet.findMany({
                where: { competitionId, matchDayId, userId: ua.userId },
                include: {
                    match: {
                        include: {
                            homeTeam: true,
                            foreignTeam: true,
                        },
                    },
                },
                orderBy: {
                    match: {
                        homeTeam: {
                            name: "asc",
                        },
                    },
                },
            });
            return {
                userId: ua.userId,
                username: ua.user.username,
                points,
                bets: bets.map((bet) => ({
                    homeTeam: bet.match.homeTeam.name,
                    foreignTeam: bet.match.foreignTeam.name,
                    userBet: [bet.homeGoals, bet.foreignGoals],
                    result: [bet.match.homeGoals, bet.match.foreignGoals],
                })),
            };
        }));
        ranking.sort((a, b) => b.points - a.points);
        return { ranking };
    }
    async getGlobalRanking(competitionId) {
        const competition = await this.getCompetitionOrThrow(competitionId);
        const globalResults = await this.db.globalResults.findFirst({
            where: { seasonId: competition.seasonId },
            include: {
                championsPositions: { select: { id: true } },
                uefaPositions: { select: { id: true } },
                demotionPositions: { select: { id: true } },
            },
            orderBy: { deadline: "desc" },
        });
        const users = await this.db.userAdministration.findMany({
            where: { competitionId },
            include: { user: true },
        });
        const seasonMatchDays = await this.db.matchDay.findMany({
            where: { seasonId: competition.seasonId },
            orderBy: { number: "asc" },
        });
        const ranking = await Promise.all(users.map(async (ua) => {
            let matchPoints = 0;
            for (const matchDay of seasonMatchDays) {
                matchPoints += await this.scoringService.getUserMatchDayPoints({
                    competitionId,
                    matchDayId: matchDay.id,
                    userId: ua.userId,
                });
            }
            const globalBet = await this.db.globalBet.findUnique({
                where: {
                    userId_competitionId: {
                        userId: ua.userId,
                        competitionId,
                    },
                },
                include: {
                    championsPositions: { select: { id: true } },
                    uefaPositions: { select: { id: true } },
                    demotionPositions: { select: { id: true } },
                },
            });
            let globalPoints = 0;
            if (globalBet && globalResults) {
                const equals10 = [
                    [globalBet.winterChampionId, globalResults.winterChampionId],
                    [globalBet.kingsCupChampionId, globalResults.kingsCupChampionId],
                    [globalBet.leagueChampionId, globalResults.leagueChampionId],
                    [globalBet.uefaChampionId, globalResults.uefaChampionId],
                    [
                        globalBet.championsLeagueChampionId,
                        globalResults.championsLeagueChampionId,
                    ],
                    [globalBet.bestGoalkeeperId, globalResults.bestGoalkeeperId],
                ];
                for (const [betValue, resultValue] of equals10) {
                    if (betValue !== null && betValue === resultValue) {
                        globalPoints += 10;
                    }
                }
                const resultChampions = new Set(globalResults.championsPositions.map((team) => team.id));
                for (const team of globalBet.championsPositions) {
                    if (resultChampions.has(team.id)) {
                        globalPoints += 10;
                    }
                }
                const resultUefa = new Set(globalResults.uefaPositions.map((team) => team.id));
                for (const team of globalBet.uefaPositions) {
                    if (resultUefa.has(team.id)) {
                        globalPoints += 10;
                    }
                }
                const resultDemotion = new Set(globalResults.demotionPositions.map((team) => team.id));
                for (const team of globalBet.demotionPositions) {
                    if (resultDemotion.has(team.id)) {
                        globalPoints += 10;
                    }
                }
            }
            return {
                userId: ua.userId,
                username: ua.user.username,
                matchPoints,
                globalPoints,
                points: matchPoints + globalPoints,
            };
        }));
        ranking.sort((a, b) => b.points - a.points);
        return { ranking };
    }
    async getDashboard(competitionId, userId) {
        const competition = await this.getCompetitionOrThrow(competitionId);
        const globalRanking = await this.getGlobalRanking(competitionId);
        const ranking = globalRanking.ranking;
        let userIndex = ranking.findIndex((entry) => entry.userId === userId);
        if (userIndex < 0) {
            userIndex = 0;
        }
        let start = ranking.length <= 12 ? 0 : Math.max(0, userIndex - 6);
        let end = Math.min(ranking.length, start + 12);
        if (end - start < 12 && ranking.length > 12) {
            start = Math.max(0, end - 12);
        }
        const users = ranking.slice(start, end).map((entry, idx) => ({
            position: start + idx + 1,
            ...entry,
        }));
        const nextMatchDay = await this.db.matchDay.findFirst({
            where: {
                seasonId: competition.seasonId,
                startDate: { gt: new Date() },
            },
            orderBy: { startDate: "asc" },
        });
        const nextMatchDayData = nextMatchDay
            ? await this.getMatchDay(competitionId, nextMatchDay.id, userId)
            : null;
        const scorers = nextMatchDay
            ? await this.getScorers(competitionId, nextMatchDay.id, userId)
            : null;
        return {
            competition: {
                id: competition.id,
                communityName: competition.community.name,
                seasonName: this.formatSeasonLabel(competition.season),
            },
            leaderboard: users,
            nextMatchDay: nextMatchDayData?.matchDay ?? null,
            nextMatchDayBets: nextMatchDayData?.bets ?? [],
            goalsBet: scorers?.goalsBet ?? null,
        };
    }
};
exports.CompetitionsService = CompetitionsService;
exports.CompetitionsService = CompetitionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        scoring_service_1.ScoringService])
], CompetitionsService);
//# sourceMappingURL=competitions.service.js.map