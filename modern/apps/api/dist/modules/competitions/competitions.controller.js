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
exports.CompetitionsController = void 0;
const common_1 = require("@nestjs/common");
const competitions_service_1 = require("./competitions.service");
const auth_service_1 = require("../auth/auth.service");
let CompetitionsController = class CompetitionsController {
    constructor(competitionsService, authService) {
        this.competitionsService = competitionsService;
        this.authService = authService;
    }
    getDashboard(competitionId, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        return this.competitionsService.getDashboard(competitionId, userId);
    }
    getMatchDays(competitionId) {
        return this.competitionsService.getMatchDays(competitionId);
    }
    getMatchDay(competitionId, matchDayId, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        return this.competitionsService.getMatchDay(competitionId, matchDayId, userId);
    }
    upsertMatchDayBets(competitionId, matchDayId, payload, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        return this.competitionsService.upsertMatchDayBets(competitionId, matchDayId, payload, userId);
    }
    getScorers(competitionId, matchDayId, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        return this.competitionsService.getScorers(competitionId, matchDayId, userId);
    }
    upsertScorers(competitionId, matchDayId, payload, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        return this.competitionsService.upsertScorers(competitionId, matchDayId, payload, userId);
    }
    getGlobalBets(competitionId, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        return this.competitionsService.getGlobalBets(competitionId, userId);
    }
    upsertGlobalBets(competitionId, payload, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        return this.competitionsService.upsertGlobalBets(competitionId, payload, userId);
    }
    getMatchDayRanking(competitionId, matchDayId) {
        return this.competitionsService.getMatchDayRanking(competitionId, matchDayId);
    }
    getGlobalRanking(competitionId) {
        return this.competitionsService.getGlobalRanking(competitionId);
    }
};
exports.CompetitionsController = CompetitionsController;
__decorate([
    (0, common_1.Get)(":competitionId/dashboard"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)(":competitionId/match-days"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "getMatchDays", null);
__decorate([
    (0, common_1.Get)(":competitionId/match-days/:matchDayId"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "getMatchDay", null);
__decorate([
    (0, common_1.Put)(":competitionId/match-days/:matchDayId/bets"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, String]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "upsertMatchDayBets", null);
__decorate([
    (0, common_1.Get)(":competitionId/match-days/:matchDayId/scorers"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "getScorers", null);
__decorate([
    (0, common_1.Put)(":competitionId/match-days/:matchDayId/scorers"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, String]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "upsertScorers", null);
__decorate([
    (0, common_1.Get)(":competitionId/global-bets"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "getGlobalBets", null);
__decorate([
    (0, common_1.Put)(":competitionId/global-bets"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "upsertGlobalBets", null);
__decorate([
    (0, common_1.Get)(":competitionId/match-days/:matchDayId/ranking"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "getMatchDayRanking", null);
__decorate([
    (0, common_1.Get)(":competitionId/global-ranking"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CompetitionsController.prototype, "getGlobalRanking", null);
exports.CompetitionsController = CompetitionsController = __decorate([
    (0, common_1.Controller)("api/competitions"),
    __metadata("design:paramtypes", [competitions_service_1.CompetitionsService,
        auth_service_1.AuthService])
], CompetitionsController);
//# sourceMappingURL=competitions.controller.js.map