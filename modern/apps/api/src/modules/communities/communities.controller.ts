import { Body, Controller, Get, Headers, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { CommunitiesService } from "./communities.service";
import { AuthService } from "../auth/auth.service";

@Controller("api/communities")
export class CommunitiesController {
  constructor(
    private readonly communitiesService: CommunitiesService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  list(@Query("query") query?: string) {
    return this.communitiesService.list(query);
  }

  @Post()
  create(
    @Body() payload: { name: string; description: string },
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    return this.communitiesService.create(userId, payload.name, payload.description);
  }

  @Post(":communityId/join")
  join(
    @Param("communityId", ParseIntPipe) communityId: number,
    @Headers("authorization") authorization?: string,
  ) {
    const userId = this.authService.requireSessionFromAuthorizationHeader(authorization).user.id;
    return this.communitiesService.join(communityId, userId);
  }
}
