import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";
import { fetchMatchDayRanking } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  params: Promise<{ competitionId: string; matchDayId: string }>;
};

type BetRow = {
  matchId: number;
  homeTeam: string;
  foreignTeam: string;
  userBet: { homeGoals: number | null; foreignGoals: number | null };
  realResult: { homeGoals: number | null; foreignGoals: number | null };
};

type RankingEntry = {
  userId: number;
  username: string;
  points: number;
  bets: BetRow[];
};

function betClass(bet: BetRow): string {
  const { homeGoals: rh, foreignGoals: rf } = bet.realResult;
  const { homeGoals: bh, foreignGoals: bf } = bet.userBet;
  if (rh === null || rf === null || bh === null || bf === null) return "";
  if (bh === rh && bf === rf) return "text-green-600 font-semibold";
  if (Math.sign(rh - rf) === Math.sign(bh - bf)) return "text-amber-600";
  return "text-red-500";
}

export default async function MatchDayRankingPage({ params }: Props) {
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const matchDayId = Number(routeParams.matchDayId);
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const data = await fetchMatchDayRanking(competitionId, matchDayId);
  const ranking: RankingEntry[] = data.ranking ?? [];
  const firstEntry = ranking[0];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        Match Day {matchDayId} Ranking
      </h1>

      {ranking.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No ranking data yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Player</TableHead>
                  {firstEntry.bets.map((b) => (
                    <TableHead
                      key={b.matchId}
                      className="text-center text-xs font-normal"
                    >
                      <span className="block font-medium">
                        {b.homeTeam} vs {b.foreignTeam}
                      </span>
                      {b.realResult.homeGoals !== null && (
                        <span className="block text-muted-foreground">
                          ({b.realResult.homeGoals}:{b.realResult.foreignGoals})
                        </span>
                      )}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.map((entry, i) => (
                  <TableRow
                    key={entry.userId}
                    className={
                      entry.userId === user.id ? "bg-muted/50 font-medium" : ""
                    }
                  >
                    <TableCell>
                      {i === 0 ? (
                        <Trophy className="size-4 text-yellow-500" />
                      ) : i === 1 ? (
                        <Trophy className="size-4 text-slate-400" />
                      ) : i === 2 ? (
                        <Trophy className="size-4 text-amber-600" />
                      ) : (
                        i + 1
                      )}
                    </TableCell>
                    <TableCell>{entry.username}</TableCell>
                    {entry.bets.map((b) => (
                      <TableCell
                        key={b.matchId}
                        className={`text-center tabular-nums text-sm ${betClass(b)}`}
                      >
                        {b.userBet.homeGoals !== null
                          ? `${b.userBet.homeGoals}:${b.userBet.foreignGoals}`
                          : "–"}
                      </TableCell>
                    ))}
                    <TableCell className="text-right font-semibold">
                      {entry.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
