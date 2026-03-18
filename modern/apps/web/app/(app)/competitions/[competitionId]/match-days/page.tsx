import Link from "next/link";
import { fetchMatchDays } from "@/lib/api";
import { requireSessionUser } from "@/lib/session";

type Props = { params: Promise<{ competitionId: string }> };

export default async function MatchDaysPage({ params }: Props) {
  await requireSessionUser();
  const routeParams = await params;
  const competitionId = Number(routeParams.competitionId);
  const data = await fetchMatchDays(competitionId);

  return (
    <main>
      <section className="card">
        <span className="kicker">Match Days</span>
        <h1>Competition {competitionId}</h1>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <ul>
          {data.matchDays.map((md: any) => (
            <li key={md.id}>
              <Link className="link" href={`/competitions/${competitionId}/match-days/${md.id}`}>
                Match day {md.number}
              </Link>{" "}
              ({md.matchCount} matches)
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
