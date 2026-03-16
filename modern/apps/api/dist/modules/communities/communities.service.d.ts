import { PrismaService } from "../prisma/prisma.service";
export declare class CommunitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private get db();
    private ensureDefaultLeague;
    list(query?: string): Promise<{
        communities: any;
    }>;
    private getActiveSeason;
    create(userId: number, name: string, description: string): Promise<{
        community: any;
        competition: any;
    }>;
    join(communityId: number, userId: number): Promise<{
        competition: any;
    }>;
}
