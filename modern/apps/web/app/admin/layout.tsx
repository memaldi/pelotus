import Link from "next/link";
import { requireSessionUser } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSessionUser();

  if (!user.isPlatformAdmin) {
    return (
      <main>
        <section className="card">
          <h1>Admin Access Required</h1>
          <p>Your user is not a platform admin.</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="card" style={{ marginBottom: 16 }}>
        <span className="kicker">Admin</span>
        <h1>Administration</h1>
        <nav className="nav nav-pills gap-2 admin-nav" aria-label="Admin navigation">
          <Link className="nav-link link" href="/admin">Overview</Link>
          <Link className="nav-link link" href="/admin/leagues">Leagues</Link>
          <Link className="nav-link link" href="/admin/seasons">Seasons</Link>
          <Link className="nav-link link" href="/admin/communities">Communities</Link>
          <Link className="nav-link link" href="/admin/competitions">Competitions</Link>
          <Link className="nav-link link" href="/admin/teams">Teams</Link>
          <Link className="nav-link link" href="/admin/players">Players</Link>
          <Link className="nav-link link" href="/admin/squad">Squad</Link>
          <Link className="nav-link link" href="/admin/global-bets">Global Bets</Link>
          <Link className="nav-link link" href="/admin/match-days">Match Days</Link>
          <Link className="nav-link link" href="/admin/matches">Matches</Link>
        </nav>
      </section>
      {children}
    </main>
  );
}
