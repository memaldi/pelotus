import { Module } from "@nestjs/common";
import { ScoringController } from "./scoring.controller";
import { ScoringService } from "./scoring.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [ScoringController],
  providers: [ScoringService],
})
export class ScoringModule {}
