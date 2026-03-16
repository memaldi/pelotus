import Link from "next/link";
import { getSessionUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <main>
      <section className="card">
        <span className="kicker">Pelotus Rebuild</span>
        <h1>Modern JavaScript migration baseline</h1>
        <p>
          This workspace contains the first production-ready slice of the rewrite:
          Prisma data model, NestJS API, and Next.js UI.
        </p>
        <p>
          Start by opening a competition sandbox page and validating migrated endpoints.
        </p>
        <p>
          {user ? (
            <>
              <Link className="link" href="/registration/community">
                Continue as {user.username}
              </Link>{" "}
              | <Link className="link" href="/competitions/1">Open competition #1</Link>
              {user.isPlatformAdmin ? (
                <>
                  {" "}| <Link className="link" href="/admin">Admin Console</Link>
                </>
              ) : null}
            </>
          ) : (
            <>
              <Link className="link" href="/join">Create account</Link>{" "}
              | <Link className="link" href="/login">Login</Link>
            </>
          )}
        </p>
      </section>
    </main>
  );
}
