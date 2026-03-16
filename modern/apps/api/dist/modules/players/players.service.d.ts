import { PrismaService } from "../prisma/prisma.service";
export declare class PlayersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPlayersByTeamPosition(teamId: number, seasonId: number, position: string): Promise<any>;
}
