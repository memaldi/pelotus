import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { fetchUserCompetitions } from "@/lib/api";

export default async function HomePage() {
  const user = await getSessionUser();

  let competitions: { id: number; communityName: string; seasonName: string }[] =
    [];
  if (user) {
    try {
      const data = await fetchUserCompetitions();
      competitions = data.competitions;
    } catch {
      competitions = [];
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Pelotus</h1>

      {user ? (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Welcome back, <strong>{user.username}</strong>.
          </p>

          {competitions.length > 0 ? (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Your competitions</h2>
              <ul className="space-y-2">
                {competitions.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/competitions/${c.id}/dashboard`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                    >
                      <span className="font-medium">{c.communityName}</span>
                      <span className="text-sm text-muted-foreground">
                        {c.seasonName}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-lg border border-border p-4 text-muted-foreground">
              <p>You are not part of any competition yet.</p>
              <Link
                href="/registration/community"
                className="mt-2 block text-primary hover:underline"
              >
                Join or create a community →
              </Link>
            </div>
          )}

          <div className="flex gap-4 text-sm">
            <Link
              href="/registration/community"
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              Join another community
            </Link>
            {user.isPlatformAdmin && (
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                Admin Console
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            A football prediction league app. Log in to access your competitions.
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Log in
            </Link>
            <Link
              href="/join"
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Create account
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
