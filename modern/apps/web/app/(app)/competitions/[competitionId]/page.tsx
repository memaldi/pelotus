import Link from "next/link";
import { fetchPlayersByTeamSeasonPosition, fetchUserMatchDayPoints } from "@/lib/api";
import { requireSessionUser } from "@/lib/session";

type CompetitionPageProps = {
  params: { competitionId: string };
};

export default async function CompetitionPage({ params }: CompetitionPageProps) {
  const competitionId = Number(params.competitionId);
  await requireSessionUser();

  let goalkeepers: { id: number; name: string }[] = [];
  let points: number | null = null;

  try {
    goalkeepers = await fetchPlayersByTeamSeasonPosition({
      teamId: 1,
      seasonId: 1,
      position: "GK",
    });
  } catch {
    goalkeepers = [];
  }

  try {
    const result = await fetchUserMatchDayPoints({
      competitionId,
      matchDayId: 1,
    });
    points = result.points;
  } catch {
    points = null;
  }

  return (
    <main>
      <section className="card">
        <span className="kicker">Competition</span>
        <h1>Competition {competitionId}</h1>
        <p>
          This page demonstrates the migrated backend contracts with server-rendered
          calls from Next.js.
        </p>
        <p>
          <Link className="link" href={`/competitions/${competitionId}/dashboard`}>
            Dashboard
          </Link>{" "}
          |{" "}
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

      <section className="grid cols-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Goalkeepers (Team 1, Season 1)</h2>
          {goalkeepers.length === 0 ? (
            <p>No players returned yet. Seed data to see values.</p>
          ) : (
            <ul>
              {goalkeepers.map((player) => (
                <li key={player.id}>{player.name}</li>
              ))}
            </ul>
          )}
        </article>

        <article className="card">
          <h2>User Match-Day Points</h2>
          {points === null ? (
            <p>Points unavailable. Check API and seed data.</p>
          ) : (
            <p style={{ fontSize: 36, margin: 0 }}>{points}</p>
          )}
        </article>
      </section>
    </main>
  );
}
