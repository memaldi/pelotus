import { Controller, Get, Headers, Param, ParseIntPipe } from "@nestjs/common";
import { ScoringService } from "./scoring.service";
import { AuthService } from "../auth/auth.service";

@Controller("api/scoring")
export class ScoringController {
  constructor(
    private readonly scoringService: ScoringService,
    private readonly authService: AuthService,
  ) {}

  @Get("competition/:competitionId/match-day/:matchDayId")
  async getUserMatchDayPoints(
    @Param("competitionId", ParseIntPipe) competitionId: number,
    @Param("matchDayId", ParseIntPipe) matchDayId: number,
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    const points = await this.scoringService.getUserMatchDayPoints({
      competitionId,
      matchDayId,
      userId,
    });

    return { points };
  }
}
