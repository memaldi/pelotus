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
exports.ScoringController = void 0;
const common_1 = require("@nestjs/common");
const scoring_service_1 = require("./scoring.service");
const auth_service_1 = require("../auth/auth.service");
let ScoringController = class ScoringController {
    constructor(scoringService, authService) {
        this.scoringService = scoringService;
        this.authService = authService;
    }
    async getUserMatchDayPoints(competitionId, matchDayId, authorization) {
        const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
        const points = await this.scoringService.getUserMatchDayPoints({
            competitionId,
            matchDayId,
            userId,
        });
        return { points };
    }
};
exports.ScoringController = ScoringController;
__decorate([
    (0, common_1.Get)("competition/:competitionId/match-day/:matchDayId"),
    __param(0, (0, common_1.Param)("competitionId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)("matchDayId", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ScoringController.prototype, "getUserMatchDayPoints", null);
exports.ScoringController = ScoringController = __decorate([
    (0, common_1.Controller)("api/scoring"),
    __metadata("design:paramtypes", [scoring_service_1.ScoringService,
        auth_service_1.AuthService])
], ScoringController);
//# sourceMappingURL=scoring.controller.js.map