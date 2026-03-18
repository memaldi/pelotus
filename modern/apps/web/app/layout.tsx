import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { Badge } from "@/components/ui/badge";

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
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
            <Link className="text-lg font-semibold tracking-tight" href="/">Pelotus</Link>
            {user ? (
              <nav className="flex items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="outline">{user.username}</Badge>
                <Link className="font-medium text-foreground/90 hover:text-foreground" href="/logout">Logout</Link>
              </nav>
            ) : (
              <nav className="flex items-center gap-4 text-sm">
                <Link className="font-medium text-foreground/80 hover:text-foreground" href="/login">Login</Link>
                <Link className="font-medium text-foreground/80 hover:text-foreground" href="/join">Create account</Link>
              </nav>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
