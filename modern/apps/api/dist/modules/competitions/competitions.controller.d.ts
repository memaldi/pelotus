import { CompetitionsService } from "./competitions.service";
import { UpdateGlobalBetDto } from "./dto/update-global-bet.dto";
import { UpdateMatchDayBetsDto } from "./dto/update-match-day-bets.dto";
import { UpdateScorersDto } from "./dto/update-scorers.dto";
import { AuthService } from "../auth/auth.service";
export declare class CompetitionsController {
    private readonly competitionsService;
    private readonly authService;
    constructor(competitionsService: CompetitionsService, authService: AuthService);
    getMyCompetitions(authorization?: string): Promise<{
        competitions: any;
    }>;
    getDashboard(competitionId: number, authorization?: string): Promise<{
        competition: {
            id: any;
            communityName: any;
            seasonName: string;
        };
        leaderboard: any[];
        nextMatchDay: {
            id: any;
            number: any;
            startDate: any;
        } | null;
        nextMatchDayBets: any[];
        goalsBet: {
            forwardId: any;
            midfieldId: any;
            defenseId: any;
            forwardName: any;
            midfieldName: any;
            defenseName: any;
        } | null;
    }>;
    getMatchDays(competitionId: number): Promise<{
        competition: {
            id: any;
            communityName: any;
            seasonName: string;
        };
        matchDays: any;
    }>;
    getMatchDay(competitionId: number, matchDayId: number, authorization?: string): Promise<{
        matchDay: {
            id: any;
            number: any;
            startDate: any;
        };
        bets: any[];
    }>;
    upsertMatchDayBets(competitionId: number, matchDayId: number, payload: UpdateMatchDayBetsDto, authorization?: string): Promise<{
        matchDay: {
            id: any;
            number: any;
            startDate: any;
        };
        bets: any[];
    }>;
    getScorers(competitionId: number, matchDayId: number, authorization?: string): Promise<{
        teams: any;
        candidates: {
            defenders: any;
            midfielders: any;
            forwards: any;
        };
        goalsBet: {
            forwardId: any;
            midfieldId: any;
            defenseId: any;
            forwardName: any;
            midfieldName: any;
            defenseName: any;
        } | null;
    }>;
    upsertScorers(competitionId: number, matchDayId: number, payload: UpdateScorersDto, authorization?: string): Promise<{
        teams: any;
        candidates: {
            defenders: any;
            midfielders: any;
            forwards: any;
        };
        goalsBet: {
            forwardId: any;
            midfieldId: any;
            defenseId: any;
            forwardName: any;
            midfieldName: any;
            defenseName: any;
        } | null;
    }>;
    getGlobalBets(competitionId: number, authorization?: string): Promise<{
        globalResult: any;
        globalBet: any;
        charts: {
            winterChampion: {
                name: string;
                value: number;
            }[];
            leagueChampion: {
                name: string;
                value: number;
            }[];
            uefaChampion: {
                name: string;
                value: number;
            }[];
            kingsCupChampion: {
                name: string;
                value: number;
            }[];
            championsLeagueChampion: {
                name: string;
                value: number;
            }[];
        };
        teams: {
            spanishLeague: any;
            kingsCup: any;
            uefa: any;
            champions: any;
        };
        goalkeepers: any;
    }>;
    upsertGlobalBets(competitionId: number, payload: UpdateGlobalBetDto, authorization?: string): Promise<{
        globalResult: any;
        globalBet: any;
        charts: {
            winterChampion: {
                name: string;
                value: number;
            }[];
            leagueChampion: {
                name: string;
                value: number;
            }[];
            uefaChampion: {
                name: string;
                value: number;
            }[];
            kingsCupChampion: {
                name: string;
                value: number;
            }[];
            championsLeagueChampion: {
                name: string;
                value: number;
            }[];
        };
        teams: {
            spanishLeague: any;
            kingsCup: any;
            uefa: any;
            champions: any;
        };
        goalkeepers: any;
    }>;
    getMatchDayRanking(competitionId: number, matchDayId: number): Promise<{
        ranking: any[];
    }>;
    getGlobalRanking(competitionId: number): Promise<{
        ranking: any[];
    }>;
}
