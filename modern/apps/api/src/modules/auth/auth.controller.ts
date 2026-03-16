import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(
    @Body()
    payload: {
      username: string;
      email: string;
      password: string;
      passwordConfirmation: string;
    },
  ) {
    return this.authService.register(payload);
  }

  @Post("login")
  login(@Body() payload: { username: string; password: string }) {
    return this.authService.login(payload.username, payload.password);
  }

  @Get("me")
  me(@Headers("authorization") authorization?: string) {
    const session = this.authService.requireSessionFromAuthorizationHeader(authorization);

    return { user: session.user };
  }
}
