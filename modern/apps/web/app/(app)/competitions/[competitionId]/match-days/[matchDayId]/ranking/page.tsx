import { fetchMatchDayRanking } from "@/lib/api";
import { requireSessionUser } from "@/lib/session";

type Props = { params: Promise<{ competitionId: string; matchDayId: string }> };

export default async function MatchDayRankingPage({ params }: Props) {
  await requireSessionUser();
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const matchDayId = Number(routeParams.matchDayId);
  const data = await fetchMatchDayRanking(competitionId, matchDayId);

  return (
    <main>
      <section className="card">
        <span className="kicker">Ranking</span>
        <h1>Match day {matchDayId} ranking</h1>
        <ol>
          {data.ranking.map((entry: any) => (
            <li key={entry.userId}>
              {entry.username}: {entry.points} pts
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
