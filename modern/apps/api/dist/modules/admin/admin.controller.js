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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    constructor(adminService, authService) {
        this.adminService = adminService;
        this.authService = authService;
    }
    async bootstrap(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.getBootstrap();
    }
    async listLeagues(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listLeagues();
    }
    async createLeague(authorization, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createLeague(payload);
    }
    async updateLeague(authorization, leagueId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.updateLeague(leagueId, payload);
    }
    async deleteLeague(authorization, leagueId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.deleteLeague(leagueId);
    }
    async listSeasons(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listSeasons();
    }
    async createSeason(authorization, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createSeason(payload);
    }
    async updateSeason(authorization, seasonId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.updateSeason(seasonId, payload);
    }
    async deleteSeason(authorization, seasonId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.deleteSeason(seasonId);
    }
    async listCommunities(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listCommunities();
    }
    async createCommunity(authorization, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createCommunity(payload);
    }
    async updateCommunity(authorization, communityId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.updateCommunity(communityId, payload);
    }
    async deleteCommunity(authorization, communityId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.deleteCommunity(communityId);
    }
    async listCompetitions(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listCompetitions();
    }
    async createCompetition(authorization, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createCompetition(payload);
    }
    async updateCompetition(authorization, competitionId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.updateCompetition(competitionId, payload);
    }
    async deleteCompetition(authorization, competitionId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.deleteCompetition(competitionId);
    }
    async listTeams(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listTeams();
    }
    async listTeamInSeasons(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listTeamInSeasons();
    }
    async removeTeamFromSeason(authorization, teamInSeasonId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.removeTeamFromSeason(teamInSeasonId);
    }
    async createMatchDay(authorization, competitionId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createMatchDay(competitionId, payload);
    }
    async createTeam(authorization, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createTeam(payload);
    }
    async updateTeam(authorization, teamId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.updateTeam(teamId, payload);
    }
    async deleteTeam(authorization, teamId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.deleteTeam(teamId);
    }
    async createPlayer(authorization, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createPlayer(payload);
    }
    async listPlayers(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listPlayers();
    }
    async updatePlayer(authorization, playerId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.updatePlayer(playerId, payload);
    }
    async deletePlayer(authorization, playerId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.deletePlayer(playerId);
    }
    async listMatchDays(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listMatchDays();
    }
    async createMatchDayEntry(authorization, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createMatchDayEntry(payload);
    }
    async updateMatchDay(authorization, matchDayId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.updateMatchDay(matchDayId, payload);
    }
    async deleteMatchDay(authorization, matchDayId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.deleteMatchDay(matchDayId);
    }
    async addTeamToSeason(authorization, seasonId, teamId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.addTeamToSeason(seasonId, teamId, payload);
    }
    async createMatch(authorization, matchDayId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createMatch(matchDayId, payload);
    }
    async listMatches(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listMatches();
    }
    async createMatchEntry(authorization, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.createMatchEntry(payload);
    }
    async updateMatch(authorization, matchId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.updateMatch(matchId, payload);
    }
    async deleteMatch(authorization, matchId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.deleteMatch(matchId);
    }
    async assignPlayerToTeamInSeason(authorization, teamInSeasonId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.assignPlayerToTeamInSeason(teamInSeasonId, payload);
    }
    async removePlayerFromTeamInSeason(authorization, teamInSeasonId, playerId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.removePlayerFromTeamInSeason(teamInSeasonId, playerId);
    }
    async setMatchResult(authorization, matchId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.setMatchResult(matchId, payload);
    }
    async setPlayerGoals(authorization, matchDayId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.setPlayerGoals(matchDayId, payload);
    }
    async getPlayerGoalsForMatchDay(authorization, matchDayId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.getPlayerGoalsForMatchDay(matchDayId);
    }
    async deletePlayerGoal(authorization, playerGoalId) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.deletePlayerGoal(playerGoalId);
    }
    async upsertGlobalResults(authorization, seasonId, payload) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.upsertGlobalResults(seasonId, payload);
    }
    async listGlobalResults(authorization) {
        await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
        return this.adminService.listGlobalResults();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("bootstrap"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "bootstrap", null);
__decorate([
    (0, common_1.Get)("leagues"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listLeagues", null);
__decorate([
    (0, common_1.Post)("leagues"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createLeague", null);
__decorate([
    (0, common_1.Put)("leagues/:leagueId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("leagueId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateLeague", null);
__decorate([
    (0, common_1.Delete)("leagues/:leagueId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("leagueId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteLeague", null);
__decorate([
    (0, common_1.Get)("seasons"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listSeasons", null);
__decorate([
    (0, common_1.Post)("seasons"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSeason", null);
__decorate([
    (0, common_1.Put)("seasons/:seasonId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("seasonId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSeason", null);
__decorate([
    (0, common_1.Delete)("seasons/:seasonId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("seasonId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteSeason", null);
__decorate([
    (0, common_1.Get)("communities"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listCommunities", null);
__decorate([
    (0, common_1.Post)("communities"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCommunity", null);
__decorate([
    (0, common_1.Put)("communities/:communityId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("communityId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCommunity", null);
__decorate([
    (0, common_1.Delete)("communities/:communityId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("communityId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCommunity", null);
__decorate([
    (0, common_1.Get)("competitions"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listCompetitions", null);
__decorate([
    (0, common_1.Post)("competitions"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCompetition", null);
__decorate([
    (0, common_1.Put)("competitions/:competitionId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCompetition", null);
__decorate([
    (0, common_1.Delete)("competitions/:competitionId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCompetition", null);
__decorate([
    (0, common_1.Get)("teams"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listTeams", null);
__decorate([
    (0, common_1.Get)("team-in-seasons"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listTeamInSeasons", null);
__decorate([
    (0, common_1.Delete)("team-in-seasons/:teamInSeasonId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("teamInSeasonId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removeTeamFromSeason", null);
__decorate([
    (0, common_1.Post)("competitions/:competitionId/match-days"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createMatchDay", null);
__decorate([
    (0, common_1.Post)("teams"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createTeam", null);
__decorate([
    (0, common_1.Put)("teams/:teamId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("teamId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateTeam", null);
__decorate([
    (0, common_1.Delete)("teams/:teamId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("teamId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTeam", null);
__decorate([
    (0, common_1.Post)("players"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createPlayer", null);
__decorate([
    (0, common_1.Get)("players"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listPlayers", null);
__decorate([
    (0, common_1.Put)("players/:playerId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("playerId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updatePlayer", null);
__decorate([
    (0, common_1.Delete)("players/:playerId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("playerId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deletePlayer", null);
__decorate([
    (0, common_1.Get)("match-days"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listMatchDays", null);
__decorate([
    (0, common_1.Post)("match-days"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createMatchDayEntry", null);
__decorate([
    (0, common_1.Put)("match-days/:matchDayId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateMatchDay", null);
__decorate([
    (0, common_1.Delete)("match-days/:matchDayId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteMatchDay", null);
__decorate([
    (0, common_1.Post)("seasons/:seasonId/teams/:teamId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("seasonId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)("teamId", common_1.ParseIntPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addTeamToSeason", null);
__decorate([
    (0, common_1.Post)("match-days/:matchDayId/matches"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createMatch", null);
__decorate([
    (0, common_1.Get)("matches"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listMatches", null);
__decorate([
    (0, common_1.Post)("matches"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createMatchEntry", null);
__decorate([
    (0, common_1.Put)("matches/:matchId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("matchId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateMatch", null);
__decorate([
    (0, common_1.Delete)("matches/:matchId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("matchId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteMatch", null);
__decorate([
    (0, common_1.Post)("team-in-seasons/:teamInSeasonId/players"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("teamInSeasonId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignPlayerToTeamInSeason", null);
__decorate([
    (0, common_1.Delete)("team-in-seasons/:teamInSeasonId/players/:playerId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("teamInSeasonId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)("playerId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "removePlayerFromTeamInSeason", null);
__decorate([
    (0, common_1.Put)("matches/:matchId/result"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("matchId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setMatchResult", null);
__decorate([
    (0, common_1.Put)("match-days/:matchDayId/player-goals"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setPlayerGoals", null);
__decorate([
    (0, common_1.Get)("match-days/:matchDayId/player-goals"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPlayerGoalsForMatchDay", null);
__decorate([
    (0, common_1.Delete)("player-goals/:playerGoalId"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("playerGoalId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deletePlayerGoal", null);
__decorate([
    (0, common_1.Put)("seasons/:seasonId/global-results"),
    __param(0, (0, common_1.Headers)("authorization")),
    __param(1, (0, common_1.Param)("seasonId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "upsertGlobalResults", null);
__decorate([
    (0, common_1.Get)("global-results"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listGlobalResults", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)("api/admin"),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        auth_service_1.AuthService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map