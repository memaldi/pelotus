import Link from "next/link";

export default function AdminPage() {
  return (
    <section className="grid cols-2">
      <article className="card">
        <h2>Leagues</h2>
        <p>Create, edit and delete leagues.</p>
        <Link className="link" href="/admin/leagues">Open leagues</Link>
      </article>
      <article className="card">
        <h2>Seasons</h2>
        <p>Create, edit and delete seasons within a league.</p>
        <Link className="link" href="/admin/seasons">Open seasons</Link>
      </article>
      <article className="card">
        <h2>Communities</h2>
        <p>Create, edit and delete communities.</p>
        <Link className="link" href="/admin/communities">Open communities</Link>
      </article>
      <article className="card">
        <h2>Competitions</h2>
        <p>Create, edit and delete competitions.</p>
        <Link className="link" href="/admin/competitions">Open competitions</Link>
      </article>
      <article className="card">
        <h2>Teams</h2>
        <p>Create, edit and delete teams.</p>
        <Link className="link" href="/admin/teams">Open teams</Link>
      </article>
      <article className="card">
        <h2>Players</h2>
        <p>Create, edit and delete players.</p>
        <Link className="link" href="/admin/players">Open players</Link>
      </article>
      <article className="card">
        <h2>Squad</h2>
        <p>Assign players to teams within a season.</p>
        <Link className="link" href="/admin/squad">Open squad</Link>
      </article>
      <article className="card">
        <h2>Global Bets</h2>
        <p>Manage global bets/results configuration by season.</p>
        <Link className="link" href="/admin/global-bets">Open global bets</Link>
      </article>
      <article className="card">
        <h2>Match Days</h2>
        <p>Create, edit and delete match days.</p>
        <Link className="link" href="/admin/match-days">Open match days</Link>
      </article>
      <article className="card">
        <h2>Matches</h2>
        <p>Create, edit and delete matches.</p>
        <Link className="link" href="/admin/matches">Open matches</Link>
      </article>
    </section>
  );
}
