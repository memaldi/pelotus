"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Save, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Season = {
  id: number;
  leagueId: number;
  name: string;
  league: { id: number; name: string };
};

type MatchDay = {
  id: number;
  seasonId: number;
  number: number;
  startDate: string;
  season: { name: string; league: { name: string } };
};

function formatSeasonLabel(season: Season | MatchDay["season"]) {
  return `${season.league.name} / ${season.name}`;
}

function toLocalDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function MatchDaysCrud() {
  const searchParams = useSearchParams();
  const requestedLeagueId = searchParams.get("leagueId");

  const [items, setItems] = useState<MatchDay[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [status, setStatus] = useState("");

  const [seasonId, setSeasonId] = useState<number | "">("");
  const [number, setNumber] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");

  async function load() {
    const [matchDaysRes, seasonsRes] = await Promise.all([
      fetch("/api/backend/api/admin/match-days", { cache: "no-store" }),
      fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
    ]);

    if (!matchDaysRes.ok || !seasonsRes.ok) {
      setStatus("Failed to load match days context");
      return;
    }

    const matchDaysPayload = (await matchDaysRes.json()) as { matchDays?: MatchDay[] };
    const seasonsPayload = (await seasonsRes.json()) as { seasons?: Season[] };

    setItems(matchDaysPayload.matchDays ?? []);
    setSeasons(seasonsPayload.seasons ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const visibleSeasons = requestedLeagueId
    ? seasons.filter((season) => Number(season.leagueId) === Number(requestedLeagueId))
    : seasons;

  const filteredSeasonIds = new Set(visibleSeasons.map((season) => season.id));
  const filteredItems = requestedLeagueId ? items.filter((item) => filteredSeasonIds.has(item.seasonId)) : items;

  useEffect(() => {
    if (!requestedLeagueId || seasonId !== "") {
      return;
    }

    const firstSeason = visibleSeasons[0];
    if (firstSeason) {
      setSeasonId(firstSeason.id);
    }
  }, [requestedLeagueId, visibleSeasons, seasonId]);

  async function createItem() {
    if (seasonId === "" || number === "" || !startDate) {
      setStatus("Season, number and start date are required");
      return;
    }

    setStatus("Saving...");
    const res = await fetch("/api/backend/api/admin/match-days", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seasonId,
        number,
        startDate: new Date(startDate).toISOString(),
      }),
    });

    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      setSeasonId(requestedLeagueId && visibleSeasons[0] ? visibleSeasons[0].id : "");
      setNumber("");
      setStartDate("");
      await load();
    }
  }

  async function updateItem(item: MatchDay) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/match-days/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seasonId: item.seasonId,
        number: item.number,
        startDate: item.startDate,
      }),
    });

    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      await load();
    }
  }

  async function deleteItem(id: number) {
    setStatus("Deleting...");
    const res = await fetch(`/api/backend/api/admin/match-days/${id}`, { method: "DELETE" });

    setStatus(res.ok ? "Deleted" : "Delete failed");
    if (res.ok) {
      await load();
    }
  }

  const isError = status.toLowerCase().includes("failed") || status.toLowerCase().includes("required");

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            Match Days
          </CardTitle>
          <CardDescription>
            {requestedLeagueId
              ? "Managing match days inside the selected league."
              : "Create match days against the correct season."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-12">
          <div className="space-y-2 md:col-span-5">
            <Label>Season</Label>
            <Select
              value={seasonId === "" ? undefined : String(seasonId)}
              onValueChange={(value) => setSeasonId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose season" />
              </SelectTrigger>
              <SelectContent>
                {visibleSeasons.map((season) => (
                  <SelectItem key={season.id} value={String(season.id)}>
                    {formatSeasonLabel(season)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="matchday-number">Number</Label>
            <Input
              id="matchday-number"
              type="number"
              value={number}
              onChange={(event) =>
                setNumber(event.target.value === "" ? "" : Number(event.target.value))
              }
              placeholder="38"
            />
          </div>

          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="matchday-start">Start date</Label>
            <Input
              id="matchday-start"
              type="datetime-local"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="md:col-span-2 md:self-end">
            <Button className="w-full" onClick={() => void createItem()}>
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="secondary">Match day #{item.id}</Badge>
                <span className="text-sm text-muted-foreground">
                  {formatSeasonLabel(item.season)}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="space-y-2 md:col-span-5">
                  <Label>Season</Label>
                  <Select
                    value={String(item.seasonId)}
                    onValueChange={(value) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, seasonId: Number(value) } : x,
                        ),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visibleSeasons.map((season) => (
                        <SelectItem key={season.id} value={String(season.id)}>
                          {formatSeasonLabel(season)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Number</Label>
                  <Input
                    type="number"
                    value={item.number}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, number: Number(event.target.value) } : x,
                        ),
                      )
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label>Start</Label>
                  <Input
                    type="datetime-local"
                    value={toLocalDateTime(item.startDate)}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id
                            ? { ...x, startDate: new Date(event.target.value).toISOString() }
                            : x,
                        ),
                      )
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-2 md:col-span-2 md:self-end">
                  <Button size="sm" onClick={() => void updateItem(item)}>
                    <Save className="mr-2 size-4" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => void deleteItem(item.id)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {status ? (
        <Alert variant={isError ? "destructive" : "default"}>
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      ) : null}
    </section>
  );
}
