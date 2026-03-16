import Link from "next/link";
import { fetchDashboard } from "@/lib/api";
import { requireSessionUser } from "@/lib/session";

type Props = { params: { competitionId: string } };

export default async function DashboardPage({ params }: Props) {
  const competitionId = Number(params.competitionId);
  await requireSessionUser();
  const data = await fetchDashboard(competitionId);

  return (
    <main>
      <section className="card">
        <span className="kicker">Dashboard</span>
        <h1>
          {data.competition.communityName} ({data.competition.seasonName})
        </h1>
        <p>
          <Link className="link" href={`/competitions/${competitionId}/match-days`}>
            Match days
          </Link>{" "}
          |{" "}
          <Link className="link" href={`/competitions/${competitionId}/global-bets`}>
            Global bets
          </Link>{" "}
          |{" "}
          <Link className="link" href={`/competitions/${competitionId}/global-ranking`}>
            Global ranking
          </Link>
        </p>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Leaderboard</h2>
        <ol>
          {data.leaderboard.map((entry: any) => (
            <li key={entry.userId}>
              #{entry.position} {entry.username}: {entry.points} pts
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
