"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Trophy } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type League = {
  id: number;
  name: string;
  description: string;
};

type Season = {
  id: number;
  leagueId: number;
  name: string;
  startDate: string;
  endDate: string;
};

export function LeagueControlCenter() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      const [leaguesRes, seasonsRes] = await Promise.all([
        fetch("/api/backend/api/admin/leagues", { cache: "no-store" }),
        fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
      ]);

      if (!leaguesRes.ok || !seasonsRes.ok) {
        setStatus("Failed to load league overview.");
        return;
      }

      const leaguesPayload = (await leaguesRes.json()) as { leagues: League[] };
      const seasonsPayload = (await seasonsRes.json()) as { seasons: Season[] };
      setLeagues(leaguesPayload.leagues ?? []);
      setSeasons(seasonsPayload.seasons ?? []);
    }

    void load();
  }, []);

  const seasonCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const season of seasons) {
      counts.set(season.leagueId, (counts.get(season.leagueId) ?? 0) + 1);
    }
    return counts;
  }, [seasons]);

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5 text-primary" />
              League Control Center
            </CardTitle>
            <CardDescription>
              Choose a league to enter its dedicated workspace and operations.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/leagues">Open league manager</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {leagues.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {leagues.map((league) => (
                <Link
                  key={league.id}
                  href={`/admin/leagues/${league.id}`}
                  className="group rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-accent/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold">{league.name}</h3>
                    <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {league.description || "No description yet."}
                  </p>
                  <div className="mt-3">
                    <Badge variant="secondary">
                      {seasonCounts.get(league.id) ?? 0} season{(seasonCounts.get(league.id) ?? 0) === 1 ? "" : "s"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center">
              <p className="text-sm text-muted-foreground">No leagues available yet.</p>
              <Button asChild className="mt-3">
                <Link href="/admin/leagues">Create your first league</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {status ? (
        <Alert variant="destructive">
          <AlertTitle>Load Error</AlertTitle>
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      ) : null}
    </section>
  );
}
