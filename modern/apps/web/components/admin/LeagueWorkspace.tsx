"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, ShieldAlert, Swords, Trophy, Users } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function LeagueWorkspace({ leagueId }: { leagueId: number }) {
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
        setStatus("Failed to load league workspace.");
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

  const selectedLeague = leagues.find((league) => league.id === leagueId) ?? null;
  const selectedLeagueSeasons = seasons.filter((season) => season.leagueId === leagueId);

  if (!selectedLeague) {
    return (
      <section className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              League Not Found
            </CardTitle>
            <CardDescription>
              The requested league was not found or is no longer available.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/admin">Back to dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/leagues">Open league manager</Link>
            </Button>
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

  return (
    <section className="space-y-6">
      <Card className="border-primary/20 bg-linear-to-r from-primary/10 via-card to-accent/40">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-2xl">{selectedLeague.name}</CardTitle>
            <CardDescription>
              League workspace with direct access to all league-scoped operations.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/admin">
                <ArrowLeft className="mr-2 size-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/leagues">Edit leagues</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>League Snapshot</CardTitle>
            <CardDescription>Current context and seasonal depth.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant="secondary">{seasonCounts.get(selectedLeague.id) ?? 0} seasons</Badge>
            <p className="text-sm text-muted-foreground">
              {selectedLeague.description || "No description provided."}
            </p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-8">
          <CardHeader>
            <CardTitle>Operations</CardTitle>
            <CardDescription>Jump directly into league-specific management areas.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Button asChild className="justify-start">
              <Link href={`/admin/seasons?leagueId=${selectedLeague.id}`}>
                <CalendarDays className="mr-2 size-4" />
                Manage seasons
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href={`/admin/competitions?leagueId=${selectedLeague.id}`}>
                <Trophy className="mr-2 size-4" />
                Competitions
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href={`/admin/squad?leagueId=${selectedLeague.id}`}>
                <Users className="mr-2 size-4" />
                Squad
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href={`/admin/global-bets?leagueId=${selectedLeague.id}`}>
                <Trophy className="mr-2 size-4" />
                Global bets
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href={`/admin/match-days?leagueId=${selectedLeague.id}`}>
                <CalendarDays className="mr-2 size-4" />
                Match days
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href={`/admin/matches?leagueId=${selectedLeague.id}`}>
                <Swords className="mr-2 size-4" />
                Matches
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seasons</CardTitle>
          <CardDescription>Current seasons configured inside this league.</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedLeagueSeasons.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Season</TableHead>
                    <TableHead>Dates</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedLeagueSeasons.map((season) => (
                    <TableRow key={season.id}>
                      <TableCell>{season.name}</TableCell>
                      <TableCell>
                        {season.startDate} - {season.endDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No seasons yet.</p>
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
