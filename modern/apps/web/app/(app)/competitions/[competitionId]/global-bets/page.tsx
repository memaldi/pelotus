import { GlobalBetEditor } from "@/components/GlobalBetEditor";
import { fetchGlobalBets } from "@/lib/api";
import { requireSessionUser } from "@/lib/session";

type Props = { params: { competitionId: string } };

export default async function GlobalBetsPage({ params }: Props) {
  const competitionId = Number(params.competitionId);
  await requireSessionUser();
  const data = await fetchGlobalBets(competitionId);

  return (
    <main>
      <section className="card">
        <span className="kicker">Global Bets</span>
        <h1>Competition {competitionId}</h1>
      </section>

      <section className="grid cols-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Available teams</h2>
          <p>League: {data.teams.spanishLeague.length}</p>
          <p>Kings cup: {data.teams.kingsCup.length}</p>
          <p>UEFA: {data.teams.uefa.length}</p>
          <p>Champions: {data.teams.champions.length}</p>
        </article>

        <article className="card">
          <h2>Your global bet</h2>
          {data.globalBet ? (
            <p>Configured.</p>
          ) : (
            <p>Not configured yet.</p>
          )}
        </article>
      </section>

      <GlobalBetEditor
        competitionId={competitionId}
        teams={data.teams}
        goalkeepers={data.goalkeepers}
        initial={data.globalBet}
      />

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Global bet charts</h2>
        <p>Winter champion picks: {data.charts.winterChampion.length}</p>
        <p>League champion picks: {data.charts.leagueChampion.length}</p>
        <p>UEFA champion picks: {data.charts.uefaChampion.length}</p>
      </section>
    </main>
  );
}
