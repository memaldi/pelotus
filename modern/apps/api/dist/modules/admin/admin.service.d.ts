import { PrismaService } from "../prisma/prisma.service";
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private get db();
    getBootstrap(): Promise<{
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
    listGlobalResults(): Promise<{
        globalResults: any[];
    }>;
    createLeague(payload: {
        name: string;
        description: string;
    }): Promise<{
        league: any;
    }>;
    listLeagues(): Promise<{
        leagues: any;
    }>;
    updateLeague(leagueId: number, payload: {
        name: string;
        description: string;
    }): Promise<{
        league: any;
    }>;
    deleteLeague(leagueId: number): Promise<{
        deleted: boolean;
    }>;
    createSeason(payload: {
        leagueId: number;
        name: string;
        description: string;
        startDate: string;
        endDate: string;
    }): Promise<{
        season: any;
    }>;
    listSeasons(): Promise<{
        seasons: any;
    }>;
    updateSeason(seasonId: number, payload: {
        leagueId: number;
        name: string;
        description: string;
        startDate: string;
        endDate: string;
    }): Promise<{
        season: any;
    }>;
    deleteSeason(seasonId: number): Promise<{
        deleted: boolean;
    }>;
    createCommunity(payload: {
        name: string;
        description: string;
    }): Promise<{
        community: any;
    }>;
    listCommunities(): Promise<{
        communities: any;
    }>;
    updateCommunity(communityId: number, payload: {
        name: string;
        description: string;
    }): Promise<{
        community: any;
    }>;
    deleteCommunity(communityId: number): Promise<{
        deleted: boolean;
    }>;
    createCompetition(payload: {
        seasonId: number;
        communityId: number;
    }): Promise<{
        competition: any;
    }>;
    listCompetitions(): Promise<{
        competitions: any;
    }>;
    updateCompetition(competitionId: number, payload: {
        seasonId: number;
        communityId: number;
    }): Promise<{
        competition: any;
    }>;
    deleteCompetition(competitionId: number): Promise<{
        deleted: boolean;
    }>;
    createMatchDay(competitionId: number, payload: {
        number: number;
        startDate: string;
    }): Promise<{
        matchDay: any;
    }>;
    createTeam(payload: {
        name: string;
    }): Promise<{
        team: any;
    }>;
    listTeams(): Promise<{
        teams: any;
    }>;
    updateTeam(teamId: number, payload: {
        name: string;
    }): Promise<{
        team: any;
    }>;
    deleteTeam(teamId: number): Promise<{
        deleted: boolean;
    }>;
    createPlayer(payload: {
        name: string;
    }): Promise<{
        player: any;
    }>;
    listPlayers(): Promise<{
        players: any;
    }>;
    updatePlayer(playerId: number, payload: {
        name: string;
    }): Promise<{
        player: any;
    }>;
    deletePlayer(playerId: number): Promise<{
        deleted: boolean;
    }>;
    listTeamInSeasons(): Promise<{
        teamInSeasons: any;
    }>;
    listMatchDays(): Promise<{
        matchDays: any;
    }>;
    createMatchDayEntry(payload: {
        seasonId: number;
        number: number;
        startDate: string;
    }): Promise<{
        matchDay: any;
    }>;
    updateMatchDay(matchDayId: number, payload: {
        seasonId: number;
        number: number;
        startDate: string;
    }): Promise<{
        matchDay: any;
    }>;
    deleteMatchDay(matchDayId: number): Promise<{
        deleted: boolean;
    }>;
    listMatches(): Promise<{
        matches: any;
    }>;
    createMatchEntry(payload: {
        matchDayId: number;
        homeTeamId: number;
        foreignTeamId: number;
        homeGoals?: number | null;
        foreignGoals?: number | null;
    }): Promise<{
        match: any;
    }>;
    updateMatch(matchId: number, payload: {
        matchDayId: number;
        homeTeamId: number;
        foreignTeamId: number;
        homeGoals?: number | null;
        foreignGoals?: number | null;
    }): Promise<{
        match: any;
    }>;
    deleteMatch(matchId: number): Promise<{
        deleted: boolean;
    }>;
    removeTeamFromSeason(teamInSeasonId: number): Promise<{
        deleted: boolean;
    }>;
    addTeamToSeason(seasonId: number, teamId: number, payload: {
        spanishLeague?: boolean;
        uefaLeague?: boolean;
        championsLeague?: boolean;
        kingsCup?: boolean;
    }): Promise<{
        teamInSeason: any;
    }>;
    createMatch(matchDayId: number, payload: {
        homeTeamId: number;
        foreignTeamId: number;
    }): Promise<{
        match: any;
    }>;
    assignPlayerToTeamInSeason(teamInSeasonId: number, payload: {
        playerId: number;
        position: "GK" | "DF" | "MF" | "FW";
    }): Promise<{
        playerInTeam: any;
    }>;
    removePlayerFromTeamInSeason(teamInSeasonId: number, playerId: number): Promise<{
        deleted: boolean;
    }>;
    setMatchResult(matchId: number, payload: {
        homeGoals: number;
        foreignGoals: number;
    }): Promise<{
        match: any;
    }>;
    setPlayerGoals(matchDayId: number, payload: {
        playerId: number;
        goals: number;
    }): Promise<{
        playerGoal: any;
    }>;
    getPlayerGoalsForMatchDay(matchDayId: number): Promise<{
        playerGoals: any;
    }>;
    deletePlayerGoal(playerGoalId: number): Promise<{
        deleted: boolean;
    }>;
    upsertGlobalResults(seasonId: number, payload: {
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
}
