import { PrismaService } from "../prisma/prisma.service";
import { ScoringService } from "../scoring/scoring.service";
import { UpdateGlobalBetDto } from "./dto/update-global-bet.dto";
import { UpdateMatchDayBetsDto } from "./dto/update-match-day-bets.dto";
import { UpdateScorersDto } from "./dto/update-scorers.dto";
export declare class CompetitionsService {
    private readonly prisma;
    private readonly scoringService;
    constructor(prisma: PrismaService, scoringService: ScoringService);
    private get db();
    private formatSeasonLabel;
    getMyCompetitions(userId: number): Promise<{
        competitions: any;
    }>;
    getCompetitionOrThrow(competitionId: number): Promise<any>;
    getMatchDays(competitionId: number): Promise<{
        competition: {
            id: any;
            communityName: any;
            seasonName: string;
        };
        matchDays: any;
    }>;
    getMatchDay(competitionId: number, matchDayId: number, userId: number): Promise<{
        matchDay: {
            id: any;
            number: any;
            startDate: any;
        };
        bets: any[];
    }>;
    upsertMatchDayBets(competitionId: number, matchDayId: number, payload: UpdateMatchDayBetsDto, userId: number): Promise<{
        matchDay: {
            id: any;
            number: any;
            startDate: any;
        };
        bets: any[];
    }>;
    getScorers(competitionId: number, matchDayId: number, userId: number): Promise<{
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
    upsertScorers(competitionId: number, matchDayId: number, payload: UpdateScorersDto, userId: number): Promise<{
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
    getGlobalBets(competitionId: number, userId: number): Promise<{
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
    private buildCountChart;
    upsertGlobalBets(competitionId: number, payload: UpdateGlobalBetDto, userId: number): Promise<{
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
    getDashboard(competitionId: number, userId: number): Promise<{
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
}
