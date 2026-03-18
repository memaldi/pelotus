import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { fetchGlobalBets } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import { GlobalBetEditor } from "@/components/GlobalBetEditor";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ competitionId: string }> };

export default async function GlobalBetsPage({ params }: Props) {
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const data = await fetchGlobalBets(competitionId);

  const deadlineStr: string | null = data.globalResult?.deadline ?? null;
  const deadlinePassed = deadlineStr
    ? Date.now() > new Date(deadlineStr).getTime()
    : false;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Global Bets</h1>
        {deadlineStr && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-3" />
            Deadline:{" "}
            {new Date(deadlineStr).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {deadlinePassed ? (
              <Badge variant="destructive">Closed</Badge>
            ) : (
              <Badge className="bg-green-500 text-white">Open</Badge>
            )}
          </div>
        )}
      </div>

      <GlobalBetEditor
        competitionId={competitionId}
        teams={data.teams}
        goalkeepers={data.goalkeepers}
        initial={data.globalBet}
        deadlinePassed={deadlinePassed}
      />
    </div>
  );
}
