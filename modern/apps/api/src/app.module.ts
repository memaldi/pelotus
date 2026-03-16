import { Module } from "@nestjs/common";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { HealthController } from "./modules/health/health.controller";
import { PlayersModule } from "./modules/players/players.module";
import { ScoringModule } from "./modules/scoring/scoring.module";
import { CompetitionsModule } from "./modules/competitions/competitions.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CommunitiesModule } from "./modules/communities/communities.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    PrismaModule,
    PlayersModule,
    ScoringModule,
    CompetitionsModule,
    AuthModule,
    CommunitiesModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
