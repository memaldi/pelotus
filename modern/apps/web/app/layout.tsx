import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Pelotus Modern",
  description: "Modern rewrite of Pelotus with Next.js + NestJS",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  return (
    <html lang="es">
      <body>
        <header style={{ borderBottom: "1px solid #e5ddcc", background: "#fff9ee" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link className="link" href="/">Pelotus</Link>
            {user ? (
              <nav style={{ display: "flex", gap: 12 }}>
                <span>Signed in as {user.username}</span>
                <Link className="link" href="/logout">Logout</Link>
              </nav>
            ) : (
              <nav style={{ display: "flex", gap: 12 }}>
                <Link className="link" href="/login">Login</Link>
                <Link className="link" href="/join">Create account</Link>
              </nav>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
