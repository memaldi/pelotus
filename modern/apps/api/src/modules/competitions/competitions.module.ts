import { Module } from "@nestjs/common";
import { CompetitionsController } from "./competitions.controller";
import { CompetitionsService } from "./competitions.service";
import { ScoringService } from "../scoring/scoring.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [CompetitionsController],
  providers: [CompetitionsService, ScoringService],
})
export class CompetitionsModule {}
