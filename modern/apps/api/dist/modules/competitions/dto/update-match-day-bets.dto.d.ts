export type MatchBetInput = {
    matchId: number;
    homeGoals: number | null;
    foreignGoals: number | null;
};
export type UpdateMatchDayBetsDto = {
    bets: MatchBetInput[];
};
