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
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const POSITION_MAP = {
    GK: client_1.PlayerPosition.GK,
    DF: client_1.PlayerPosition.DF,
    MF: client_1.PlayerPosition.MF,
    FW: client_1.PlayerPosition.FW,
};
let PlayersService = class PlayersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlayersByTeamPosition(teamId, seasonId, position) {
        const prisma = this.prisma;
        const normalizedPosition = position.toUpperCase();
        const prismaPosition = POSITION_MAP[normalizedPosition];
        if (!prismaPosition) {
            throw new common_1.BadRequestException("Position must be one of GK, DF, MF, FW");
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
        return players.map((entry) => entry.player);
    }
};
exports.PlayersService = PlayersService;
exports.PlayersService = PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlayersService);
//# sourceMappingURL=players.service.js.map