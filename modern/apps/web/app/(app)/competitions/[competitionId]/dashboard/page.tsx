import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Clock, Trophy } from "lucide-react";
import { fetchDashboard } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = { params: Promise<{ competitionId: string }> };

type BetRow = {
  matchId: number;
  homeTeam: string;
  foreignTeam: string;
  userBet: { homeGoals: number | null; foreignGoals: number | null };
  realResult: { homeGoals: number | null; foreignGoals: number | null };
};

type LeaderboardEntry = {
  userId: number;
  username: string;
  points: number;
  position: number;
  matchPoints: number;
  globalPoints: number;
};

function isDeadlinePassed(startDate: string): boolean {
  return Date.now() > new Date(startDate).getTime() - 3 * 60 * 60 * 1000;
}

export default async function DashboardPage({ params }: Props) {
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const data = await fetchDashboard(competitionId);
  const nextMatchDay: { id: number; number: number; startDate: string } | null =
    data.nextMatchDay ?? null;
  const nextMatchDayBets: BetRow[] = data.nextMatchDayBets ?? [];
  const goalsBet: {
    defenseName: string | null;
    midfieldName: string | null;
    forwardName: string | null;
  } | null = data.goalsBet ?? null;
  const leaderboard: LeaderboardEntry[] = data.leaderboard ?? [];

  const deadlinePassed = nextMatchDay
    ? isDeadlinePassed(nextMatchDay.startDate)
    : false;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{data.competition.communityName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {data.competition.seasonName}
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Left column: next match day + scorer picks */}
        <div className="space-y-4">
          {nextMatchDay ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="size-4 text-muted-foreground" />
                  Next: Match Day {nextMatchDay.number}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="size-3" />
                  {new Date(nextMatchDay.startDate).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {deadlinePassed ? (
                    <Badge variant="destructive" className="ml-1">
                      Deadline passed
                    </Badge>
                  ) : (
                    <Badge className="ml-1 bg-green-500 text-white">
                      Open for bets
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {nextMatchDayBets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No bets placed yet.</p>
                ) : (
                  nextMatchDayBets.map((bet) => (
                    <div
                      key={bet.matchId}
                      className="flex items-center justify-between rounded-md border border-border p-2 text-sm"
                    >
                      <span className="font-medium">{bet.homeTeam}</span>
                      <span className="mx-2 font-mono text-muted-foreground">
                        {bet.userBet.homeGoals ?? "–"}
                        {" : "}
                        {bet.userBet.foreignGoals ?? "–"}
                      </span>
                      <span className="font-medium">{bet.foreignTeam}</span>
                    </div>
                  ))
                )}
                <Link
                  href={`/competitions/${competitionId}/match-days/${nextMatchDay.id}`}
                  className="mt-1 block text-sm text-primary hover:underline"
                >
                  {deadlinePassed ? "View bets →" : "Edit bets →"}
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">No upcoming match day.</p>
              </CardContent>
            </Card>
          )}

          {goalsBet && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Scorer Picks (Next Match Day)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Defender ×5</span>
                  <span>{goalsBet.defenseName ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Midfielder ×3</span>
                  <span>{goalsBet.midfieldName ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Forward ×1</span>
                  <span>{goalsBet.forwardName ?? "—"}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
                  <TableRow
                    key={entry.userId}
                    className={
                      entry.userId === user.id ? "bg-muted/50 font-medium" : ""
                    }
                  >
                    <TableCell>
                      {entry.position === 1 ? (
                        <Trophy className="size-4 text-yellow-500" />
                      ) : entry.position === 2 ? (
                        <Trophy className="size-4 text-slate-400" />
                      ) : entry.position === 3 ? (
                        <Trophy className="size-4 text-amber-600" />
                      ) : (
                        entry.position
                      )}
                    </TableCell>
                    <TableCell>{entry.username}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {entry.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
