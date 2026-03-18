import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { CompetitionsService } from "./competitions.service";
import { UpdateGlobalBetDto } from "./dto/update-global-bet.dto";
import { UpdateMatchDayBetsDto } from "./dto/update-match-day-bets.dto";
import { UpdateScorersDto } from "./dto/update-scorers.dto";
import { AuthService } from "../auth/auth.service";

@Controller("api/competitions")
export class CompetitionsController {
  constructor(
    private readonly competitionsService: CompetitionsService,
    private readonly authService: AuthService,
  ) {}

  @Get("mine")
  getMyCompetitions(@Headers("authorization") authorization?: string) {
    const userId =
      this.authService.requireSessionFromAuthorizationHeader(
        authorization,
      ).user.id;
    return this.competitionsService.getMyCompetitions(userId);
  }

  @Get(":competitionId/dashboard")
  getDashboard(
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    return this.competitionsService.getDashboard(competitionId, userId);
  }

  @Get(":competitionId/match-days")
  getMatchDays(@Param("competitionId", ParseIntPipe) competitionId: number) {
    return this.competitionsService.getMatchDays(competitionId);
  }

  @Get(":competitionId/match-days/:matchDayId")
  getMatchDay(
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    return this.competitionsService.getMatchDay(competitionId, matchDayId, userId);
  }

  @Put(":competitionId/match-days/:matchDayId/bets")
  upsertMatchDayBets(
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
    @Body() payload: UpdateMatchDayBetsDto,
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    return this.competitionsService.upsertMatchDayBets(competitionId, matchDayId, payload, userId);
  }

  @Get(":competitionId/match-days/:matchDayId/scorers")
  getScorers(
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    return this.competitionsService.getScorers(competitionId, matchDayId, userId);
  }

  @Put(":competitionId/match-days/:matchDayId/scorers")
  upsertScorers(
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
    @Body() payload: UpdateScorersDto,
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    return this.competitionsService.upsertScorers(competitionId, matchDayId, payload, userId);
  }

  @Get(":competitionId/global-bets")
  getGlobalBets(
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    return this.competitionsService.getGlobalBets(competitionId, userId);
  }

  @Put(":competitionId/global-bets")
  upsertGlobalBets(
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Body() payload: UpdateGlobalBetDto,
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    return this.competitionsService.upsertGlobalBets(competitionId, payload, userId);
  }

  @Get(":competitionId/match-days/:matchDayId/ranking")
  getMatchDayRanking(
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
  ) {
    return this.competitionsService.getMatchDayRanking(competitionId, matchDayId);
  }

  @Get(":competitionId/global-ranking")
  getGlobalRanking(@Param("competitionId", ParseIntPipe) competitionId: number) {
    return this.competitionsService.getGlobalRanking(competitionId);
  }
}
