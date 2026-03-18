import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { AdminService } from "./admin.service";

@Controller("api/admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Get("bootstrap")
  async bootstrap(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.getBootstrap();
  }

  @Get("leagues")
  async listLeagues(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listLeagues();
  }

  @Post("leagues")
  async createLeague(
    @Headers("authorization") authorization: string | undefined,
    @Body() payload: { name: string; description: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createLeague(payload);
  }

  @Put("leagues/:leagueId")
  async updateLeague(
    @Headers("authorization") authorization: string | undefined,
    @Param("leagueId", ParseIntPipe) leagueId: number,
    @Body() payload: { name: string; description: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.updateLeague(leagueId, payload);
  }

  @Delete("leagues/:leagueId")
  async deleteLeague(
    @Headers("authorization") authorization: string | undefined,
    @Param("leagueId", ParseIntPipe) leagueId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.deleteLeague(leagueId);
  }

  @Get("seasons")
  async listSeasons(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listSeasons();
  }

  @Post("seasons")
  async createSeason(
    @Headers("authorization") authorization: string | undefined,
    @Body()
    payload: { leagueId: number; name: string; description: string; startDate: string; endDate: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createSeason(payload);
  }

  @Put("seasons/:seasonId")
  async updateSeason(
    @Headers("authorization") authorization: string | undefined,
    @Param("seasonId", ParseIntPipe) seasonId: number,
    @Body()
    payload: { leagueId: number; name: string; description: string; startDate: string; endDate: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.updateSeason(seasonId, payload);
  }

  @Delete("seasons/:seasonId")
  async deleteSeason(
    @Headers("authorization") authorization: string | undefined,
    @Param("seasonId", ParseIntPipe) seasonId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.deleteSeason(seasonId);
  }

  @Get("communities")
  async listCommunities(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listCommunities();
  }

  @Post("communities")
  async createCommunity(
    @Headers("authorization") authorization: string | undefined,
    @Body() payload: { name: string; description: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createCommunity(payload);
  }

  @Put("communities/:communityId")
  async updateCommunity(
    @Headers("authorization") authorization: string | undefined,
    @Param("communityId", ParseIntPipe) communityId: number,
    @Body() payload: { name: string; description: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.updateCommunity(communityId, payload);
  }

  @Delete("communities/:communityId")
  async deleteCommunity(
    @Headers("authorization") authorization: string | undefined,
    @Param("communityId", ParseIntPipe) communityId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.deleteCommunity(communityId);
  }

  @Get("competitions")
  async listCompetitions(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listCompetitions();
  }

  @Post("competitions")
  async createCompetition(
    @Headers("authorization") authorization: string | undefined,
    @Body() payload: { seasonId: number; communityId: number },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createCompetition(payload);
  }

  @Put("competitions/:competitionId")
  async updateCompetition(
    @Headers("authorization") authorization: string | undefined,
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Body() payload: { seasonId: number; communityId: number },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.updateCompetition(competitionId, payload);
  }

  @Delete("competitions/:competitionId")
  async deleteCompetition(
    @Headers("authorization") authorization: string | undefined,
    @Param("competitionId", ParseIntPipe) competitionId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.deleteCompetition(competitionId);
  }

  @Get("teams")
  async listTeams(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listTeams();
  }

  @Get("team-in-seasons")
  async listTeamInSeasons(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listTeamInSeasons();
  }

  @Delete("team-in-seasons/:teamInSeasonId")
  async removeTeamFromSeason(
    @Headers("authorization") authorization: string | undefined,
    @Param("teamInSeasonId", ParseIntPipe) teamInSeasonId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.removeTeamFromSeason(teamInSeasonId);
  }

  @Post("competitions/:competitionId/match-days")
  async createMatchDay(
    @Headers("authorization") authorization: string | undefined,
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Body() payload: { number: number; startDate: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createMatchDay(competitionId, payload);
  }

  @Post("teams")
  async createTeam(
    @Headers("authorization") authorization: string | undefined,
    @Body() payload: { name: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createTeam(payload);
  }

  @Put("teams/:teamId")
  async updateTeam(
    @Headers("authorization") authorization: string | undefined,
    @Param("teamId", ParseIntPipe) teamId: number,
    @Body() payload: { name: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.updateTeam(teamId, payload);
  }

  @Delete("teams/:teamId")
  async deleteTeam(
    @Headers("authorization") authorization: string | undefined,
    @Param("teamId", ParseIntPipe) teamId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.deleteTeam(teamId);
  }

  @Post("players")
  async createPlayer(
    @Headers("authorization") authorization: string | undefined,
    @Body() payload: { name: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createPlayer(payload);
  }

  @Get("players")
  async listPlayers(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listPlayers();
  }

  @Put("players/:playerId")
  async updatePlayer(
    @Headers("authorization") authorization: string | undefined,
    @Param("playerId", ParseIntPipe) playerId: number,
    @Body() payload: { name: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.updatePlayer(playerId, payload);
  }

  @Delete("players/:playerId")
  async deletePlayer(
    @Headers("authorization") authorization: string | undefined,
    @Param("playerId", ParseIntPipe) playerId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.deletePlayer(playerId);
  }

  @Get("match-days")
  async listMatchDays(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listMatchDays();
  }

  @Post("match-days")
  async createMatchDayEntry(
    @Headers("authorization") authorization: string | undefined,
    @Body() payload: { seasonId: number; number: number; startDate: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createMatchDayEntry(payload);
  }

  @Put("match-days/:matchDayId")
  async updateMatchDay(
    @Headers("authorization") authorization: string | undefined,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
    @Body() payload: { seasonId: number; number: number; startDate: string },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.updateMatchDay(matchDayId, payload);
  }

  @Delete("match-days/:matchDayId")
  async deleteMatchDay(
    @Headers("authorization") authorization: string | undefined,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.deleteMatchDay(matchDayId);
  }

  @Post("seasons/:seasonId/teams/:teamId")
  async addTeamToSeason(
    @Headers("authorization") authorization: string | undefined,
    @Param("seasonId", ParseIntPipe) seasonId: number,
    @Param("teamId", ParseIntPipe) teamId: number,
    @Body()
    payload: {
      spanishLeague?: boolean;
      uefaLeague?: boolean;
      championsLeague?: boolean;
      kingsCup?: boolean;
    },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.addTeamToSeason(seasonId, teamId, payload);
  }

  @Post("match-days/:matchDayId/matches")
  async createMatch(
    @Headers("authorization") authorization: string | undefined,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
    @Body() payload: { homeTeamId: number; foreignTeamId: number },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createMatch(matchDayId, payload);
  }

  @Get("matches")
  async listMatches(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listMatches();
  }

  @Post("matches")
  async createMatchEntry(
    @Headers("authorization") authorization: string | undefined,
    @Body()
    payload: {
      matchDayId: number;
      homeTeamId: number;
      foreignTeamId: number;
      homeGoals?: number | null;
      foreignGoals?: number | null;
    },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.createMatchEntry(payload);
  }

  @Put("matches/:matchId")
  async updateMatch(
    @Headers("authorization") authorization: string | undefined,
    @Param("matchId", ParseIntPipe) matchId: number,
    @Body()
    payload: {
      matchDayId: number;
      homeTeamId: number;
      foreignTeamId: number;
      homeGoals?: number | null;
      foreignGoals?: number | null;
    },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.updateMatch(matchId, payload);
  }

  @Delete("matches/:matchId")
  async deleteMatch(
    @Headers("authorization") authorization: string | undefined,
    @Param("matchId", ParseIntPipe) matchId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.deleteMatch(matchId);
  }

  @Post("team-in-seasons/:teamInSeasonId/players")
  async assignPlayerToTeamInSeason(
    @Headers("authorization") authorization: string | undefined,
    @Param("teamInSeasonId", ParseIntPipe) teamInSeasonId: number,
    @Body() payload: { playerId: number; position: "GK" | "DF" | "MF" | "FW" },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.assignPlayerToTeamInSeason(teamInSeasonId, payload);
  }

  @Delete("team-in-seasons/:teamInSeasonId/players/:playerId")
  async removePlayerFromTeamInSeason(
    @Headers("authorization") authorization: string | undefined,
    @Param("teamInSeasonId", ParseIntPipe) teamInSeasonId: number,
    @Param("playerId", ParseIntPipe) playerId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.removePlayerFromTeamInSeason(teamInSeasonId, playerId);
  }

  @Put("matches/:matchId/result")
  async setMatchResult(
    @Headers("authorization") authorization: string | undefined,
    @Param("matchId", ParseIntPipe) matchId: number,
    @Body() payload: { homeGoals: number; foreignGoals: number },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.setMatchResult(matchId, payload);
  }

  @Put("match-days/:matchDayId/player-goals")
  async setPlayerGoals(
    @Headers("authorization") authorization: string | undefined,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
    @Body() payload: { playerId: number; goals: number },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.setPlayerGoals(matchDayId, payload);
  }

  @Get("match-days/:matchDayId/player-goals")
  async getPlayerGoalsForMatchDay(
    @Headers("authorization") authorization: string | undefined,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.getPlayerGoalsForMatchDay(matchDayId);
  }

  @Delete("player-goals/:playerGoalId")
  async deletePlayerGoal(
    @Headers("authorization") authorization: string | undefined,
    @Param("playerGoalId", ParseIntPipe) playerGoalId: number,
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.deletePlayerGoal(playerGoalId);
  }

  @Put("seasons/:seasonId/global-results")
  async upsertGlobalResults(
    @Headers("authorization") authorization: string | undefined,
    @Param("seasonId", ParseIntPipe) seasonId: number,
    @Body()
    payload: {
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
    },
  ) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.upsertGlobalResults(seasonId, payload);
  }

  @Get("global-results")
  async listGlobalResults(@Headers("authorization") authorization?: string) {
    await this.authService.requirePlatformAdminFromAuthorizationHeader(authorization);
    return this.adminService.listGlobalResults();
  }
}
