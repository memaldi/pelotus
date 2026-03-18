import { AuthService } from "../auth/auth.service";
import { AdminService } from "./admin.service";
export declare class AdminController {
    private readonly adminService;
    private readonly authService;
    constructor(adminService: AdminService, authService: AuthService);
    bootstrap(authorization?: string): Promise<{
        leagues: any;
        seasons: any;
        communities: any;
        competitions: any;
        teams: any;
        players: any;
        teamInSeasons: any;
        matchDays: any;
        matches: any;
        globalResults: any[];
    }>;
    listLeagues(authorization?: string): Promise<{
        leagues: any;
    }>;
    createLeague(authorization: string | undefined, payload: {
        name: string;
        description: string;
    }): Promise<{
        league: any;
    }>;
    updateLeague(authorization: string | undefined, leagueId: number, payload: {
        name: string;
        description: string;
    }): Promise<{
        league: any;
    }>;
    deleteLeague(authorization: string | undefined, leagueId: number): Promise<{
        deleted: boolean;
    }>;
    listSeasons(authorization?: string): Promise<{
        seasons: any;
    }>;
    createSeason(authorization: string | undefined, payload: {
        leagueId: number;
        name: string;
        description: string;
        startDate: string;
        endDate: string;
    }): Promise<{
        season: any;
    }>;
    updateSeason(authorization: string | undefined, seasonId: number, payload: {
        leagueId: number;
        name: string;
        description: string;
        startDate: string;
        endDate: string;
    }): Promise<{
        season: any;
    }>;
    deleteSeason(authorization: string | undefined, seasonId: number): Promise<{
        deleted: boolean;
    }>;
    listCommunities(authorization?: string): Promise<{
        communities: any;
    }>;
    createCommunity(authorization: string | undefined, payload: {
        name: string;
        description: string;
    }): Promise<{
        community: any;
    }>;
    updateCommunity(authorization: string | undefined, communityId: number, payload: {
        name: string;
        description: string;
    }): Promise<{
        community: any;
    }>;
    deleteCommunity(authorization: string | undefined, communityId: number): Promise<{
        deleted: boolean;
    }>;
    listCompetitions(authorization?: string): Promise<{
        competitions: any;
    }>;
    createCompetition(authorization: string | undefined, payload: {
        seasonId: number;
        communityId: number;
    }): Promise<{
        competition: any;
    }>;
    updateCompetition(authorization: string | undefined, competitionId: number, payload: {
        seasonId: number;
        communityId: number;
    }): Promise<{
        competition: any;
    }>;
    deleteCompetition(authorization: string | undefined, competitionId: number): Promise<{
        deleted: boolean;
    }>;
    listTeams(authorization?: string): Promise<{
        teams: any;
    }>;
    listTeamInSeasons(authorization?: string): Promise<{
        teamInSeasons: any;
    }>;
    removeTeamFromSeason(authorization: string | undefined, teamInSeasonId: number): Promise<{
        deleted: boolean;
    }>;
    createMatchDay(authorization: string | undefined, competitionId: number, payload: {
        number: number;
        startDate: string;
    }): Promise<{
        matchDay: any;
    }>;
    createTeam(authorization: string | undefined, payload: {
        name: string;
    }): Promise<{
        team: any;
    }>;
    updateTeam(authorization: string | undefined, teamId: number, payload: {
        name: string;
    }): Promise<{
        team: any;
    }>;
    deleteTeam(authorization: string | undefined, teamId: number): Promise<{
        deleted: boolean;
    }>;
    createPlayer(authorization: string | undefined, payload: {
        name: string;
    }): Promise<{
        player: any;
    }>;
    listPlayers(authorization?: string): Promise<{
        players: any;
    }>;
    updatePlayer(authorization: string | undefined, playerId: number, payload: {
        name: string;
    }): Promise<{
        player: any;
    }>;
    deletePlayer(authorization: string | undefined, playerId: number): Promise<{
        deleted: boolean;
    }>;
    listMatchDays(authorization?: string): Promise<{
        matchDays: any;
    }>;
    createMatchDayEntry(authorization: string | undefined, payload: {
        seasonId: number;
        number: number;
        startDate: string;
    }): Promise<{
        matchDay: any;
    }>;
    updateMatchDay(authorization: string | undefined, matchDayId: number, payload: {
        seasonId: number;
        number: number;
        startDate: string;
    }): Promise<{
        matchDay: any;
    }>;
    deleteMatchDay(authorization: string | undefined, matchDayId: number): Promise<{
        deleted: boolean;
    }>;
    addTeamToSeason(authorization: string | undefined, seasonId: number, teamId: number, payload: {
        spanishLeague?: boolean;
        uefaLeague?: boolean;
        championsLeague?: boolean;
        kingsCup?: boolean;
    }): Promise<{
        teamInSeason: any;
    }>;
    createMatch(authorization: string | undefined, matchDayId: number, payload: {
        homeTeamId: number;
        foreignTeamId: number;
    }): Promise<{
        match: any;
    }>;
    listMatches(authorization?: string): Promise<{
        matches: any;
    }>;
    createMatchEntry(authorization: string | undefined, payload: {
        matchDayId: number;
        homeTeamId: number;
        foreignTeamId: number;
        homeGoals?: number | null;
        foreignGoals?: number | null;
    }): Promise<{
        match: any;
    }>;
    updateMatch(authorization: string | undefined, matchId: number, payload: {
        matchDayId: number;
        homeTeamId: number;
        foreignTeamId: number;
        homeGoals?: number | null;
        foreignGoals?: number | null;
    }): Promise<{
        match: any;
    }>;
    deleteMatch(authorization: string | undefined, matchId: number): Promise<{
        deleted: boolean;
    }>;
    assignPlayerToTeamInSeason(authorization: string | undefined, teamInSeasonId: number, payload: {
        playerId: number;
        position: "GK" | "DF" | "MF" | "FW";
    }): Promise<{
        playerInTeam: any;
    }>;
    removePlayerFromTeamInSeason(authorization: string | undefined, teamInSeasonId: number, playerId: number): Promise<{
        deleted: boolean;
    }>;
    setMatchResult(authorization: string | undefined, matchId: number, payload: {
        homeGoals: number;
        foreignGoals: number;
    }): Promise<{
        match: any;
    }>;
    setPlayerGoals(authorization: string | undefined, matchDayId: number, payload: {
        playerId: number;
        goals: number;
    }): Promise<{
        playerGoal: any;
    }>;
    getPlayerGoalsForMatchDay(authorization: string | undefined, matchDayId: number): Promise<{
        playerGoals: any;
    }>;
    deletePlayerGoal(authorization: string | undefined, playerGoalId: number): Promise<{
        deleted: boolean;
    }>;
    upsertGlobalResults(authorization: string | undefined, seasonId: number, payload: {
        deadline: string;
        winterChampionId?: number | null;
        kingsCupChampionId?: number | null;
        leagueChampionId?: number | null;
        uefaChampionId?: number | null;
        championsLeagueChampionId?: number | null;
        bestGoalkeeperId?: number | null;
        championsPositionIds?: number[];
        uefaPositionIds?: number[];
        demotionPositionIds?: number[];
    }): Promise<{
        globalResults: any;
    }>;
    listGlobalResults(authorization?: string): Promise<{
        globalResults: any[];
    }>;
}
