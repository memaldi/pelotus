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
exports.CommunitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommunitiesService = class CommunitiesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get db() {
        return this.prisma;
    }
    async ensureDefaultLeague() {
        const existingLeague = await this.db.league.findFirst({
            orderBy: { name: "asc" },
        });
        if (existingLeague) {
            return existingLeague;
        }
        return this.db.league.create({
            data: {
                name: "General",
                description: "Auto-created default league",
            },
        });
    }
    async list(query) {
        const communities = await this.db.community.findMany({
            where: query
                ? {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                }
                : undefined,
            orderBy: { name: "asc" },
            take: 20,
        });
        return { communities };
    }
    async getActiveSeason() {
        const now = new Date();
        const currentSeason = await this.db.season.findFirst({
            where: {
                startDate: { lte: now },
                endDate: { gte: now },
            },
            orderBy: { startDate: "desc" },
        });
        if (currentSeason) {
            return currentSeason;
        }
        const latestSeason = await this.db.season.findFirst({
            orderBy: { startDate: "desc" },
        });
        if (latestSeason) {
            return latestSeason;
        }
        const league = await this.ensureDefaultLeague();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        const endDate = new Date(now);
        endDate.setFullYear(endDate.getFullYear() + 1);
        return this.db.season.create({
            data: {
                leagueId: league.id,
                name: `Season ${now.getFullYear()}`,
                description: "Auto-created initial season",
                startDate,
                endDate,
            },
        });
    }
    async create(userId, name, description) {
        const existing = await this.db.community.findUnique({ where: { name } });
        if (existing) {
            throw new common_1.BadRequestException("Community name already exists");
        }
        const season = await this.getActiveSeason();
        const community = await this.db.community.create({
            data: { name, description },
        });
        const competition = await this.db.competition.create({
            data: {
                communityId: community.id,
                seasonId: season.id,
            },
        });
        await this.db.userAdministration.upsert({
            where: {
                userId_competitionId: {
                    userId,
                    competitionId: competition.id,
                },
            },
            create: {
                userId,
                competitionId: competition.id,
                isAdmin: true,
            },
            update: {
                isAdmin: true,
            },
        });
        return { community, competition };
    }
    async join(communityId, userId) {
        const season = await this.getActiveSeason();
        const competition = await this.db.competition.findFirst({
            where: {
                communityId,
                seasonId: season.id,
            },
            include: {
                community: true,
            },
        });
        if (!competition) {
            throw new common_1.NotFoundException("No current competition exists for this community");
        }
        await this.db.userAdministration.upsert({
            where: {
                userId_competitionId: {
                    userId,
                    competitionId: competition.id,
                },
            },
            create: {
                userId,
                competitionId: competition.id,
                isAdmin: false,
            },
            update: {},
        });
        return { competition };
    }
};
exports.CommunitiesService = CommunitiesService;
exports.CommunitiesService = CommunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommunitiesService);
//# sourceMappingURL=communities.service.js.map