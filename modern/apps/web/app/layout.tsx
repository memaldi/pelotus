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
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <header className="topbar">
          <div className="topbar-inner">
            <Link className="brand link" href="/">Pelotus</Link>
            {user ? (
              <nav className="topbar-nav">
                <span>Signed in as {user.username}</span>
                <Link className="link" href="/logout">Logout</Link>
              </nav>
            ) : (
              <nav className="topbar-nav">
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
