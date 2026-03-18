import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { fetchMatchDay, fetchScorers } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import { MatchDayBetEditor } from "@/components/MatchDayBetEditor";
import { ScorersEditor } from "@/components/ScorersEditor";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ competitionId: string; matchDayId: string }>;
};

export default async function MatchDayPage({ params }: Props) {
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const matchDayId = Number(routeParams.matchDayId);
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [matchDayData, scorersData] = await Promise.all([
    fetchMatchDay(competitionId, matchDayId),
    fetchScorers(competitionId, matchDayId),
  ]);

  const startDate: string = matchDayData.matchDay.startDate;
  const deadlinePassed =
    Date.now() > new Date(startDate).getTime() - 3 * 60 * 60 * 1000;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">
          Match Day {matchDayData.matchDay.number}
        </h1>
        <div className="flex items-center gap-3">
          {deadlinePassed ? (
            <Badge variant="destructive">Deadline passed</Badge>
          ) : (
            <Badge className="bg-green-500 text-white">Open for bets</Badge>
          )}
          <Link
            href={`/competitions/${competitionId}/match-days/${matchDayId}/ranking`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
          >
            Ranking <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="size-3" />
        {new Date(startDate).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}
        {!deadlinePassed && (
          <span className="ml-1 text-xs">— deadline 3 h before kick-off</span>
        )}
      </p>

      <MatchDayBetEditor
        competitionId={competitionId}
        matchDayId={matchDayId}
        initialBets={matchDayData.bets}
        deadlinePassed={deadlinePassed}
      />

      <ScorersEditor
        competitionId={competitionId}
        matchDayId={matchDayId}
        candidates={scorersData.candidates}
        initial={
          scorersData.goalsBet
            ? {
                defenseId: scorersData.goalsBet.defenseId,
                midfieldId: scorersData.goalsBet.midfieldId,
                forwardId: scorersData.goalsBet.forwardId,
              }
            : null
        }
        deadlinePassed={deadlinePassed}
      />
    </div>
  );
}
