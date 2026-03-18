import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

type Props = {
  children: React.ReactNode;
  params: Promise<{ competitionId: string }>;
};

export default async function CompetitionLayout({ children, params }: Props) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const routeParams = await params;
  const competitionId = routeParams.competitionId;
  const base = `/competitions/${competitionId}`;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <nav className="mb-6 flex flex-wrap gap-1 rounded-xl border border-border bg-muted/40 p-1">
        <NavLink href={`${base}/dashboard`}>Dashboard</NavLink>
        <NavLink href={`${base}/match-days`}>Match Days</NavLink>
        <NavLink href={`${base}/global-bets`}>Global Bets</NavLink>
        <NavLink href={`${base}/global-ranking`}>Ranking</NavLink>
      </nav>
      {children}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
    >
      {children}
    </Link>
  );
}
