import Link from "next/link";
import { MatchDayBetEditor } from "@/components/MatchDayBetEditor";
import { ScorersEditor } from "@/components/ScorersEditor";
import { fetchMatchDay, fetchScorers } from "@/lib/api";
import { requireSessionUser } from "@/lib/session";

type Props = { params: Promise<{ competitionId: string; matchDayId: string }> };

export default async function MatchDayPage({ params }: Props) {
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const matchDayId = Number(routeParams.matchDayId);
  await requireSessionUser();

  const [matchDayData, scorersData] = await Promise.all([
    fetchMatchDay(competitionId, matchDayId),
    fetchScorers(competitionId, matchDayId),
  ]);

  return (
    <main>
      <section className="card">
        <span className="kicker">Match Day</span>
        <h1>Match day {matchDayData.matchDay.number}</h1>
        <p>
          <Link className="link" href={`/competitions/${competitionId}/match-days/${matchDayId}/ranking`}>
            View ranking
          </Link>
        </p>
      </section>

      <section style={{ marginTop: 16 }}>
        <MatchDayBetEditor
          competitionId={competitionId}
          matchDayId={matchDayId}
          initialBets={matchDayData.bets}
        />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Scorers (current selection)</h2>
        {scorersData.goalsBet ? (
          <ul>
            <li>Defense: {scorersData.goalsBet.defenseName ?? "-"}</li>
            <li>Midfield: {scorersData.goalsBet.midfieldName ?? "-"}</li>
            <li>Forward: {scorersData.goalsBet.forwardName ?? "-"}</li>
          </ul>
        ) : (
          <p>No scorer picks yet.</p>
        )}
      </section>

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
      />
    </main>
  );
}
