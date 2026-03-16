import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { PlayersService } from "./players.service";

@Controller("api")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get("team/:teamId/season/:seasonId/player/position/:position")
  getPlayersByTeamAndPosition(
    @Param("teamId", ParseIntPipe) teamId: number,
    @Param("seasonId", ParseIntPipe) seasonId: number,
    @Param("position") position: string,
  ) {
    return this.playersService.getPlayersByTeamPosition(teamId, seasonId, position);
  }
}
