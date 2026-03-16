export type UpdateGlobalBetDto = {
  winterChampionId: number | null;
  kingsCupChampionId: number | null;
  leagueChampionId: number | null;
  uefaChampionId: number | null;
  championsLeagueChampionId: number | null;
  bestGoalkeeperId: number | null;
  championsPositionIds: number[];
  uefaPositionIds: number[];
  demotionPositionIds: number[];
};
