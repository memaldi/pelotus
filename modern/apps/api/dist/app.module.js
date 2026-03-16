"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const health_controller_1 = require("./modules/health/health.controller");
const players_module_1 = require("./modules/players/players.module");
const scoring_module_1 = require("./modules/scoring/scoring.module");
const competitions_module_1 = require("./modules/competitions/competitions.module");
const auth_module_1 = require("./modules/auth/auth.module");
const communities_module_1 = require("./modules/communities/communities.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            players_module_1.PlayersModule,
            scoring_module_1.ScoringModule,
            competitions_module_1.CompetitionsModule,
            auth_module_1.AuthModule,
            communities_module_1.CommunitiesModule,
            admin_module_1.AdminModule,
        ],
        controllers: [health_controller_1.HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map