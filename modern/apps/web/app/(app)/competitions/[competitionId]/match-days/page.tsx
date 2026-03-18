import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Calendar } from "lucide-react";
import { fetchMatchDays } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { params: Promise<{ competitionId: string }> };

type MatchDay = {
  id: number;
  number: number;
  startDate: string;
  matchCount: number;
};

function isDeadlinePassed(startDate: string): boolean {
  return Date.now() > new Date(startDate).getTime() - 3 * 60 * 60 * 1000;
}

export default async function MatchDaysPage({ params }: Props) {
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const data = await fetchMatchDays(competitionId);
  const matchDays: MatchDay[] = data.matchDays ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Match Days</h1>
        <span className="text-sm text-muted-foreground">
          {matchDays.length} total
        </span>
      </div>

      {matchDays.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No match days yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {matchDays.map((md) => {
            const closed = isDeadlinePassed(md.startDate);
            const base = `/competitions/${competitionId}/match-days/${md.id}`;
            return (
              <Card
                key={md.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      Match Day {md.number}
                    </span>
                    {closed ? (
                      <Badge variant="outline">Closed</Badge>
                    ) : (
                      <Badge className="bg-green-500 text-white">Open</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {new Date(md.startDate).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" · "}
                    {md.matchCount} match{md.matchCount !== 1 ? "es" : ""}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href={base}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Bets <ArrowRight className="size-3" />
                    </Link>
                    <Link
                      href={`${base}/ranking`}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
                    >
                      Ranking <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
