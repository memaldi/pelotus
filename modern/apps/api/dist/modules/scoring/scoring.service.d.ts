import { PrismaService } from "../prisma/prisma.service";
type MatchDayPointsInput = {
    userId: number;
    matchDayId: number;
    competitionId: number;
};
export declare class ScoringService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserMatchDayPoints(input: MatchDayPointsInput): Promise<number>;
}
export {};
