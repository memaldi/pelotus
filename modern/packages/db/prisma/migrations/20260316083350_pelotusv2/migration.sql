-- CreateEnum
CREATE TYPE "PlayerPosition" AS ENUM ('GK', 'DF', 'MF', 'FW');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "description" VARCHAR(200) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competition" (
    "id" SERIAL NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "communityId" INTEGER NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchDay" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "seasonId" INTEGER NOT NULL,

    CONSTRAINT "MatchDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamInSeason" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "spanishLeague" BOOLEAN NOT NULL DEFAULT true,
    "uefaLeague" BOOLEAN NOT NULL DEFAULT false,
    "championsLeague" BOOLEAN NOT NULL DEFAULT false,
    "kingsCup" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TeamInSeason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerBelongsToTeam" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "teamInSeasonId" INTEGER NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "position" "PlayerPosition" NOT NULL DEFAULT 'GK',

    CONSTRAINT "PlayerBelongsToTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "foreignTeamId" INTEGER NOT NULL,
    "matchDayId" INTEGER NOT NULL,
    "homeGoals" INTEGER,
    "foreignGoals" INTEGER,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerGoal" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "matchDayId" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL,

    CONSTRAINT "PlayerGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAdministration" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserAdministration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "matchDayId" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "homeGoals" INTEGER,
    "foreignGoals" INTEGER,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalsBet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchDayId" INTEGER NOT NULL,
    "forwardId" INTEGER,
    "midfieldId" INTEGER,
    "defenseId" INTEGER,

    CONSTRAINT "GoalsBet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalBet" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "competitionId" INTEGER NOT NULL,
    "winterChampionId" INTEGER,
    "kingsCupChampionId" INTEGER,
    "leagueChampionId" INTEGER,
    "uefaChampionId" INTEGER,
    "championsLeagueChampionId" INTEGER,
    "bestGoalkeeperId" INTEGER,

    CONSTRAINT "GlobalBet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalResults" (
    "id" SERIAL NOT NULL,
    "seasonId" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "winterChampionId" INTEGER,
    "kingsCupChampionId" INTEGER,
    "leagueChampionId" INTEGER,
    "uefaChampionId" INTEGER,
    "championsLeagueChampionId" INTEGER,
    "bestGoalkeeperId" INTEGER,

    CONSTRAINT "GlobalResults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Competition_seasonId_communityId_key" ON "Competition"("seasonId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchDay_seasonId_number_key" ON "MatchDay"("seasonId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "TeamInSeason_teamId_seasonId_key" ON "TeamInSeason"("teamId", "seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerBelongsToTeam_playerId_teamInSeasonId_key" ON "PlayerBelongsToTeam"("playerId", "teamInSeasonId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerGoal_playerId_matchDayId_key" ON "PlayerGoal"("playerId", "matchDayId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAdministration_userId_competitionId_key" ON "UserAdministration"("userId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "Bet_userId_matchId_competitionId_key" ON "Bet"("userId", "matchId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalsBet_userId_matchDayId_key" ON "GoalsBet"("userId", "matchDayId");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalBet_userId_competitionId_key" ON "GlobalBet"("userId", "competitionId");

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchDay" ADD CONSTRAINT "MatchDay_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInSeason" ADD CONSTRAINT "TeamInSeason_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInSeason" ADD CONSTRAINT "TeamInSeason_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBelongsToTeam" ADD CONSTRAINT "PlayerBelongsToTeam_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBelongsToTeam" ADD CONSTRAINT "PlayerBelongsToTeam_teamInSeasonId_fkey" FOREIGN KEY ("teamInSeasonId") REFERENCES "TeamInSeason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerBelongsToTeam" ADD CONSTRAINT "PlayerBelongsToTeam_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_foreignTeamId_fkey" FOREIGN KEY ("foreignTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_matchDayId_fkey" FOREIGN KEY ("matchDayId") REFERENCES "MatchDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGoal" ADD CONSTRAINT "PlayerGoal_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGoal" ADD CONSTRAINT "PlayerGoal_matchDayId_fkey" FOREIGN KEY ("matchDayId") REFERENCES "MatchDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAdministration" ADD CONSTRAINT "UserAdministration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAdministration" ADD CONSTRAINT "UserAdministration_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_matchDayId_fkey" FOREIGN KEY ("matchDayId") REFERENCES "MatchDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalsBet" ADD CONSTRAINT "GoalsBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalsBet" ADD CONSTRAINT "GoalsBet_matchDayId_fkey" FOREIGN KEY ("matchDayId") REFERENCES "MatchDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalsBet" ADD CONSTRAINT "GoalsBet_forwardId_fkey" FOREIGN KEY ("forwardId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalsBet" ADD CONSTRAINT "GoalsBet_midfieldId_fkey" FOREIGN KEY ("midfieldId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalsBet" ADD CONSTRAINT "GoalsBet_defenseId_fkey" FOREIGN KEY ("defenseId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalBet" ADD CONSTRAINT "GlobalBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalBet" ADD CONSTRAINT "GlobalBet_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalBet" ADD CONSTRAINT "GlobalBet_winterChampionId_fkey" FOREIGN KEY ("winterChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalBet" ADD CONSTRAINT "GlobalBet_kingsCupChampionId_fkey" FOREIGN KEY ("kingsCupChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalBet" ADD CONSTRAINT "GlobalBet_leagueChampionId_fkey" FOREIGN KEY ("leagueChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalBet" ADD CONSTRAINT "GlobalBet_uefaChampionId_fkey" FOREIGN KEY ("uefaChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalBet" ADD CONSTRAINT "GlobalBet_championsLeagueChampionId_fkey" FOREIGN KEY ("championsLeagueChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalBet" ADD CONSTRAINT "GlobalBet_bestGoalkeeperId_fkey" FOREIGN KEY ("bestGoalkeeperId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalResults" ADD CONSTRAINT "GlobalResults_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalResults" ADD CONSTRAINT "GlobalResults_winterChampionId_fkey" FOREIGN KEY ("winterChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalResults" ADD CONSTRAINT "GlobalResults_kingsCupChampionId_fkey" FOREIGN KEY ("kingsCupChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalResults" ADD CONSTRAINT "GlobalResults_leagueChampionId_fkey" FOREIGN KEY ("leagueChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalResults" ADD CONSTRAINT "GlobalResults_uefaChampionId_fkey" FOREIGN KEY ("uefaChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalResults" ADD CONSTRAINT "GlobalResults_championsLeagueChampionId_fkey" FOREIGN KEY ("championsLeagueChampionId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalResults" ADD CONSTRAINT "GlobalResults_bestGoalkeeperId_fkey" FOREIGN KEY ("bestGoalkeeperId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
