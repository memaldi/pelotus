import { fetchGlobalRanking } from "@/lib/api";
import { requireSessionUser } from "@/lib/session";

type Props = { params: { competitionId: string } };

export default async function GlobalRankingPage({ params }: Props) {
  await requireSessionUser();
  const competitionId = Number(params.competitionId);
  const data = await fetchGlobalRanking(competitionId);

  return (
    <main>
      <section className="card">
        <span className="kicker">Global Ranking</span>
        <h1>Competition {competitionId}</h1>
        <ol>
          {data.ranking.map((entry: any) => (
            <li key={entry.userId}>
              {entry.username}: {entry.points} pts ({entry.matchPoints} match + {entry.globalPoints} global)
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
