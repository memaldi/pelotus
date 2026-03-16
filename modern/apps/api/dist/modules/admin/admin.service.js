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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get db() {
        return this.prisma;
    }
    async getBootstrap() {
        const [leagues, seasons, communities, competitions, teams, players, teamInSeasons, matchDays, matches, globalResults] = await Promise.all([
            this.db.league.findMany({ orderBy: { name: "asc" } }),
            this.db.season.findMany({
                include: { league: true },
                orderBy: [{ startDate: "desc" }, { id: "desc" }],
            }),
            this.db.community.findMany({ orderBy: { name: "asc" } }),
            this.db.competition.findMany({
                include: { season: { include: { league: true } }, community: true },
                orderBy: { id: "desc" },
            }),
            this.db.team.findMany({ orderBy: { name: "asc" } }),
            this.db.player.findMany({ orderBy: { name: "asc" } }),
            this.db.teamInSeason.findMany({
                include: {
                    team: true,
                    season: { include: { league: true } },
                },
                orderBy: [{ seasonId: "desc" }, { teamId: "asc" }],
            }),
            this.db.matchDay.findMany({
                include: {
                    season: { include: { league: true } },
                },
                orderBy: [{ seasonId: "desc" }, { number: "asc" }],
            }),
            this.db.match.findMany({
                include: {
                    matchDay: true,
                    homeTeam: true,
                    foreignTeam: true,
                },
                orderBy: [{ matchDayId: "desc" }, { id: "asc" }],
            }),
            this.listGlobalResults().then((x) => x.globalResults),
        ]);
        return {
            leagues,
            seasons,
            communities,
            competitions,
            teams,
            players,
            teamInSeasons,
            matchDays,
            matches,
            globalResults,
        };
    }
    async listGlobalResults() {
        const globalResults = await this.db.globalResults.findMany({
            include: {
                season: { include: { league: true } },
                winterChampion: true,
                kingsCupChampion: true,
                leagueChampion: true,
                uefaChampion: true,
                championsLeagueChampion: true,
                bestGoalkeeper: true,
                championsPositions: true,
                uefaPositions: true,
                demotionPositions: true,
            },
            orderBy: [{ seasonId: "asc" }, { id: "desc" }],
        });
        const latestBySeason = new Map();
        for (const row of globalResults) {
            if (!latestBySeason.has(row.seasonId)) {
                latestBySeason.set(row.seasonId, row);
            }
        }
        return { globalResults: Array.from(latestBySeason.values()) };
    }
    async createLeague(payload) {
        const existing = await this.db.league.findUnique({ where: { name: payload.name } });
        if (existing) {
            throw new common_1.BadRequestException("League name already exists");
        }
        const league = await this.db.league.create({
            data: {
                name: payload.name,
                description: payload.description,
            },
        });
        return { league };
    }
    async listLeagues() {
        const leagues = await this.db.league.findMany({ orderBy: { name: "asc" } });
        return { leagues };
    }
    async updateLeague(leagueId, payload) {
        const existingByName = await this.db.league.findUnique({ where: { name: payload.name } });
        if (existingByName && existingByName.id !== leagueId) {
            throw new common_1.BadRequestException("League name already exists");
        }
        const league = await this.db.league.update({
            where: { id: leagueId },
            data: {
                name: payload.name,
                description: payload.description,
            },
        });
        return { league };
    }
    async deleteLeague(leagueId) {
        await this.db.league.delete({ where: { id: leagueId } });
        return { deleted: true };
    }
    async createSeason(payload) {
        const league = await this.db.league.findUnique({ where: { id: payload.leagueId } });
        if (!league) {
            throw new common_1.NotFoundException("League not found");
        }
        const season = await this.db.season.create({
            data: {
                leagueId: payload.leagueId,
                name: payload.name,
                description: payload.description,
                startDate: new Date(payload.startDate),
                endDate: new Date(payload.endDate),
            },
            include: { league: true },
        });
        return { season };
    }
    async listSeasons() {
        const seasons = await this.db.season.findMany({
            include: { league: true },
            orderBy: [{ startDate: "desc" }, { id: "desc" }],
        });
        return { seasons };
    }
    async updateSeason(seasonId, payload) {
        const league = await this.db.league.findUnique({ where: { id: payload.leagueId } });
        if (!league) {
            throw new common_1.NotFoundException("League not found");
        }
        const season = await this.db.season.update({
            where: { id: seasonId },
            data: {
                leagueId: payload.leagueId,
                name: payload.name,
                description: payload.description,
                startDate: new Date(payload.startDate),
                endDate: new Date(payload.endDate),
            },
            include: { league: true },
        });
        return { season };
    }
    async deleteSeason(seasonId) {
        await this.db.season.delete({ where: { id: seasonId } });
        return { deleted: true };
    }
    async createCommunity(payload) {
        const existing = await this.db.community.findUnique({ where: { name: payload.name } });
        if (existing) {
            throw new common_1.BadRequestException("Community name already exists");
        }
        const community = await this.db.community.create({
            data: {
                name: payload.name,
                description: payload.description,
            },
        });
        return { community };
    }
    async listCommunities() {
        const communities = await this.db.community.findMany({ orderBy: { name: "asc" } });
        return { communities };
    }
    async updateCommunity(communityId, payload) {
        const existingByName = await this.db.community.findUnique({ where: { name: payload.name } });
        if (existingByName && existingByName.id !== communityId) {
            throw new common_1.BadRequestException("Community name already exists");
        }
        const community = await this.db.community.update({
            where: { id: communityId },
            data: {
                name: payload.name,
                description: payload.description,
            },
        });
        return { community };
    }
    async deleteCommunity(communityId) {
        await this.db.community.delete({ where: { id: communityId } });
        return { deleted: true };
    }
    async createCompetition(payload) {
        const competition = await this.db.competition.create({
            data: {
                seasonId: payload.seasonId,
                communityId: payload.communityId,
            },
            include: { season: { include: { league: true } }, community: true },
        });
        return { competition };
    }
    async listCompetitions() {
        const competitions = await this.db.competition.findMany({
            include: { season: { include: { league: true } }, community: true },
            orderBy: { id: "desc" },
        });
        return { competitions };
    }
    async updateCompetition(competitionId, payload) {
        const competition = await this.db.competition.update({
            where: { id: competitionId },
            data: {
                seasonId: payload.seasonId,
                communityId: payload.communityId,
            },
            include: { season: { include: { league: true } }, community: true },
        });
        return { competition };
    }
    async deleteCompetition(competitionId) {
        await this.db.competition.delete({ where: { id: competitionId } });
        return { deleted: true };
    }
    async createMatchDay(competitionId, payload) {
        const competition = await this.db.competition.findUnique({ where: { id: competitionId } });
        if (!competition) {
            throw new common_1.NotFoundException("Competition not found");
        }
        const matchDay = await this.db.matchDay.create({
            data: {
                seasonId: competition.seasonId,
                number: payload.number,
                startDate: new Date(payload.startDate),
            },
        });
        return { matchDay };
    }
    async createTeam(payload) {
        const team = await this.db.team.create({ data: { name: payload.name } });
        return { team };
    }
    async listTeams() {
        const teams = await this.db.team.findMany({ orderBy: { name: "asc" } });
        return { teams };
    }
    async updateTeam(teamId, payload) {
        const team = await this.db.team.update({
            where: { id: teamId },
            data: { name: payload.name },
        });
        return { team };
    }
    async deleteTeam(teamId) {
        await this.db.team.delete({ where: { id: teamId } });
        return { deleted: true };
    }
    async createPlayer(payload) {
        const player = await this.db.player.create({ data: { name: payload.name } });
        return { player };
    }
    async listPlayers() {
        const players = await this.db.player.findMany({ orderBy: { name: "asc" } });
        return { players };
    }
    async updatePlayer(playerId, payload) {
        const player = await this.db.player.update({
            where: { id: playerId },
            data: { name: payload.name },
        });
        return { player };
    }
    async deletePlayer(playerId) {
        await this.db.player.delete({ where: { id: playerId } });
        return { deleted: true };
    }
    async listTeamInSeasons() {
        const teamInSeasons = await this.db.teamInSeason.findMany({
            include: {
                team: true,
                season: { include: { league: true } },
                players: { include: { player: true }, orderBy: { position: "asc" } },
            },
            orderBy: [{ seasonId: "desc" }, { teamId: "asc" }],
        });
        return { teamInSeasons };
    }
    async listMatchDays() {
        const matchDays = await this.db.matchDay.findMany({
            include: { season: { include: { league: true } } },
            orderBy: [{ seasonId: "desc" }, { number: "asc" }],
        });
        return { matchDays };
    }
    async createMatchDayEntry(payload) {
        const season = await this.db.season.findUnique({ where: { id: payload.seasonId } });
        if (!season) {
            throw new common_1.NotFoundException("Season not found");
        }
        const matchDay = await this.db.matchDay.create({
            data: {
                seasonId: payload.seasonId,
                number: payload.number,
                startDate: new Date(payload.startDate),
            },
            include: { season: { include: { league: true } } },
        });
        return { matchDay };
    }
    async updateMatchDay(matchDayId, payload) {
        const matchDay = await this.db.matchDay.update({
            where: { id: matchDayId },
            data: {
                seasonId: payload.seasonId,
                number: payload.number,
                startDate: new Date(payload.startDate),
            },
            include: { season: { include: { league: true } } },
        });
        return { matchDay };
    }
    async deleteMatchDay(matchDayId) {
        await this.db.matchDay.delete({ where: { id: matchDayId } });
        return { deleted: true };
    }
    async listMatches() {
        const matches = await this.db.match.findMany({
            include: {
                matchDay: true,
                homeTeam: true,
                foreignTeam: true,
            },
            orderBy: [{ matchDayId: "desc" }, { id: "asc" }],
        });
        return { matches };
    }
    async createMatchEntry(payload) {
        if (payload.homeTeamId === payload.foreignTeamId) {
            throw new common_1.BadRequestException("Home and away teams must be different");
        }
        const match = await this.db.match.create({
            data: {
                matchDayId: payload.matchDayId,
                homeTeamId: payload.homeTeamId,
                foreignTeamId: payload.foreignTeamId,
                homeGoals: payload.homeGoals ?? null,
                foreignGoals: payload.foreignGoals ?? null,
            },
            include: {
                matchDay: true,
                homeTeam: true,
                foreignTeam: true,
            },
        });
        return { match };
    }
    async updateMatch(matchId, payload) {
        if (payload.homeTeamId === payload.foreignTeamId) {
            throw new common_1.BadRequestException("Home and away teams must be different");
        }
        const match = await this.db.match.update({
            where: { id: matchId },
            data: {
                matchDayId: payload.matchDayId,
                homeTeamId: payload.homeTeamId,
                foreignTeamId: payload.foreignTeamId,
                homeGoals: payload.homeGoals ?? null,
                foreignGoals: payload.foreignGoals ?? null,
            },
            include: {
                matchDay: true,
                homeTeam: true,
                foreignTeam: true,
            },
        });
        return { match };
    }
    async deleteMatch(matchId) {
        await this.db.match.delete({ where: { id: matchId } });
        return { deleted: true };
    }
    async removeTeamFromSeason(teamInSeasonId) {
        const entry = await this.db.teamInSeason.findUnique({ where: { id: teamInSeasonId } });
        if (!entry) {
            throw new common_1.NotFoundException("Team-in-season entry not found");
        }
        await this.db.teamInSeason.delete({ where: { id: teamInSeasonId } });
        return { deleted: true };
    }
    async addTeamToSeason(seasonId, teamId, payload) {
        const teamInSeason = await this.db.teamInSeason.upsert({
            where: {
                teamId_seasonId: {
                    teamId,
                    seasonId,
                },
            },
            create: {
                teamId,
                seasonId,
                spanishLeague: payload.spanishLeague ?? true,
                uefaLeague: payload.uefaLeague ?? false,
                championsLeague: payload.championsLeague ?? false,
                kingsCup: payload.kingsCup ?? false,
            },
            update: {
                spanishLeague: payload.spanishLeague ?? true,
                uefaLeague: payload.uefaLeague ?? false,
                championsLeague: payload.championsLeague ?? false,
                kingsCup: payload.kingsCup ?? false,
            },
        });
        return { teamInSeason };
    }
    async createMatch(matchDayId, payload) {
        if (payload.homeTeamId === payload.foreignTeamId) {
            throw new common_1.BadRequestException("Home and away teams must be different");
        }
        const match = await this.db.match.create({
            data: {
                matchDayId,
                homeTeamId: payload.homeTeamId,
                foreignTeamId: payload.foreignTeamId,
            },
            include: {
                homeTeam: true,
                foreignTeam: true,
            },
        });
        return { match };
    }
    async assignPlayerToTeamInSeason(teamInSeasonId, payload) {
        const teamInSeason = await this.db.teamInSeason.findUnique({ where: { id: teamInSeasonId } });
        if (!teamInSeason) {
            throw new common_1.NotFoundException("Team-in-season entry not found");
        }
        const playerInTeam = await this.db.playerBelongsToTeam.upsert({
            where: {
                playerId_teamInSeasonId: {
                    playerId: payload.playerId,
                    teamInSeasonId,
                },
            },
            create: {
                playerId: payload.playerId,
                teamInSeasonId,
                seasonId: teamInSeason.seasonId,
                position: payload.position,
            },
            update: {
                position: payload.position,
            },
            include: {
                player: true,
                teamInSeason: {
                    include: {
                        team: true,
                        season: true,
                    },
                },
            },
        });
        return { playerInTeam };
    }
    async removePlayerFromTeamInSeason(teamInSeasonId, playerId) {
        const entry = await this.db.playerBelongsToTeam.findUnique({
            where: { playerId_teamInSeasonId: { playerId, teamInSeasonId } },
        });
        if (!entry) {
            throw new common_1.NotFoundException("Player assignment not found");
        }
        await this.db.playerBelongsToTeam.delete({
            where: { playerId_teamInSeasonId: { playerId, teamInSeasonId } },
        });
        return { deleted: true };
    }
    async setMatchResult(matchId, payload) {
        const match = await this.db.match.findUnique({ where: { id: matchId } });
        if (!match) {
            throw new common_1.NotFoundException("Match not found");
        }
        const updated = await this.db.match.update({
            where: { id: matchId },
            data: {
                homeGoals: payload.homeGoals,
                foreignGoals: payload.foreignGoals,
            },
            include: {
                homeTeam: true,
                foreignTeam: true,
            },
        });
        return { match: updated };
    }
    async setPlayerGoals(matchDayId, payload) {
        const matchDay = await this.db.matchDay.findUnique({ where: { id: matchDayId } });
        if (!matchDay) {
            throw new common_1.NotFoundException("Match day not found");
        }
        const playerGoal = await this.db.playerGoal.upsert({
            where: {
                playerId_matchDayId: {
                    playerId: payload.playerId,
                    matchDayId,
                },
            },
            create: {
                playerId: payload.playerId,
                matchDayId,
                goals: payload.goals,
            },
            update: {
                goals: payload.goals,
            },
            include: {
                player: true,
            },
        });
        return { playerGoal };
    }
    async upsertGlobalResults(seasonId, payload) {
        const season = await this.db.season.findUnique({ where: { id: seasonId } });
        if (!season) {
            throw new common_1.NotFoundException("Season not found");
        }
        const existing = await this.db.globalResults.findFirst({
            where: { seasonId },
            orderBy: { id: "desc" },
        });
        if (!existing) {
            const globalResults = await this.db.globalResults.create({
                data: {
                    seasonId,
                    deadline: new Date(payload.deadline),
                    winterChampionId: payload.winterChampionId ?? null,
                    kingsCupChampionId: payload.kingsCupChampionId ?? null,
                    leagueChampionId: payload.leagueChampionId ?? null,
                    uefaChampionId: payload.uefaChampionId ?? null,
                    championsLeagueChampionId: payload.championsLeagueChampionId ?? null,
                    bestGoalkeeperId: payload.bestGoalkeeperId ?? null,
                    championsPositions: {
                        connect: (payload.championsPositionIds ?? []).map((id) => ({ id })),
                    },
                    uefaPositions: {
                        connect: (payload.uefaPositionIds ?? []).map((id) => ({ id })),
                    },
                    demotionPositions: {
                        connect: (payload.demotionPositionIds ?? []).map((id) => ({ id })),
                    },
                },
                include: {
                    winterChampion: true,
                    kingsCupChampion: true,
                    leagueChampion: true,
                    uefaChampion: true,
                    championsLeagueChampion: true,
                    bestGoalkeeper: true,
                    championsPositions: true,
                    uefaPositions: true,
                    demotionPositions: true,
                },
            });
            return { globalResults };
        }
        const globalResults = await this.db.globalResults.update({
            where: { id: existing.id },
            data: {
                deadline: new Date(payload.deadline),
                winterChampionId: payload.winterChampionId ?? null,
                kingsCupChampionId: payload.kingsCupChampionId ?? null,
                leagueChampionId: payload.leagueChampionId ?? null,
                uefaChampionId: payload.uefaChampionId ?? null,
                championsLeagueChampionId: payload.championsLeagueChampionId ?? null,
                bestGoalkeeperId: payload.bestGoalkeeperId ?? null,
                championsPositions: {
                    set: (payload.championsPositionIds ?? []).map((id) => ({ id })),
                },
                uefaPositions: {
                    set: (payload.uefaPositionIds ?? []).map((id) => ({ id })),
                },
                demotionPositions: {
                    set: (payload.demotionPositionIds ?? []).map((id) => ({ id })),
                },
            },
            include: {
                winterChampion: true,
                kingsCupChampion: true,
                leagueChampion: true,
                uefaChampion: true,
                championsLeagueChampion: true,
                bestGoalkeeper: true,
                championsPositions: true,
                uefaPositions: true,
                demotionPositions: true,
            },
        });
        return { globalResults };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map