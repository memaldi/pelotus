import { PlayersService } from "./players.service";
export declare class PlayersController {
    private readonly playersService;
    constructor(playersService: PlayersService);
    getPlayersByTeamAndPosition(teamId: number, seasonId: number, position: string): Promise<any>;
}
