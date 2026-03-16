import { ScoringService } from "./scoring.service";
import { AuthService } from "../auth/auth.service";
export declare class ScoringController {
    private readonly scoringService;
    private readonly authService;
    constructor(scoringService: ScoringService, authService: AuthService);
    getUserMatchDayPoints(competitionId: number, matchDayId: number, authorization?: string): Promise<{
        points: number;
    }>;
}
