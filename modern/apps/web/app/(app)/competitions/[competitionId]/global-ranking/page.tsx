import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";
import { fetchGlobalRanking } from "@/lib/api";
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

type Props = { params: Promise<{ competitionId: string }> };

type RankingEntry = {
  userId: number;
  username: string;
  points: number;
  matchPoints: number;
  globalPoints: number;
};

export default async function GlobalRankingPage({ params }: Props) {
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const data = await fetchGlobalRanking(competitionId);
  const ranking: RankingEntry[] = data.ranking ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Season Ranking</h1>

      {ranking.length === 0 ? (
        <p className="text-muted-foreground">No ranking data yet.</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Match pts</TableHead>
                  <TableHead className="text-right">Global pts</TableHead>
                  <TableHead className="text-right font-semibold">Total</TableHead>
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
                    <TableCell className="text-right tabular-nums">
                      {entry.matchPoints}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {entry.globalPoints}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
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
