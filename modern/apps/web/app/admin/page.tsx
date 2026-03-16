import Link from "next/link";

export default function AdminPage() {
  return (
    <section className="row g-3">
      {[
        { title: "Leagues", desc: "Define league categories that group seasons and competitions.", href: "/admin/leagues" },
        { title: "Seasons", desc: "Set season timeline, labels, and league relationship.", href: "/admin/seasons" },
        { title: "Communities", desc: "Create, edit and delete communities.", href: "/admin/communities" },
        { title: "Competitions", desc: "Create, edit and delete competitions.", href: "/admin/competitions" },
        { title: "Teams", desc: "Create, edit and delete teams.", href: "/admin/teams" },
        { title: "Players", desc: "Create, edit and delete players.", href: "/admin/players" },
        { title: "Squad", desc: "Enroll teams and build each squad with player roles.", href: "/admin/squad" },
        { title: "Global Bets", desc: "Configure final outcomes used in season-wide betting.", href: "/admin/global-bets" },
        { title: "Match Days", desc: "Create, edit and delete match days.", href: "/admin/match-days" },
        { title: "Matches", desc: "Create, edit and delete matches.", href: "/admin/matches" },
      ].map((item) => (
        <article key={item.href} className="col-12 col-md-6">
          <div className="card h-100 d-flex flex-column gap-2">
            <h2>{item.title}</h2>
            <p className="mb-2">{item.desc}</p>
            <div className="mt-auto">
              <Link className="btn btn-sm btn-warning" href={item.href}>Open {item.title.toLowerCase()}</Link>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
