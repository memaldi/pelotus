"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

type League = {
  id: number;
  name: string;
};

type Season = {
  id: number;
  leagueId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  league: League;
};

function toLocalDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function SeasonsCrud() {
  const searchParams = useSearchParams();
  const requestedLeagueId = searchParams.get("leagueId");

  const [items, setItems] = useState<Season[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [status, setStatus] = useState("");

  const [leagueId, setLeagueId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function formatSeasonLabel(season: Season) {
    return `${season.league.name} / ${season.name}`;
  }

  async function load() {
    const [seasonsRes, leaguesRes] = await Promise.all([
      fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/leagues", { cache: "no-store" }),
    ]);

    if (!seasonsRes.ok || !leaguesRes.ok) {
      setStatus("Failed to load seasons");
      return;
    }

    const seasonsPayload = (await seasonsRes.json()) as { seasons?: Season[] };
    const leaguesPayload = (await leaguesRes.json()) as { leagues?: League[] };
    setItems(seasonsPayload.seasons ?? []);
    setLeagues(leaguesPayload.leagues ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!requestedLeagueId) {
      return;
    }

    setLeagueId(Number(requestedLeagueId));
  }, [requestedLeagueId]);

  const filteredItems = requestedLeagueId
    ? items.filter((item) => item.leagueId === Number(requestedLeagueId))
    : items;

  const selectedLeague = useMemo(
    () => (leagueId === "" ? null : leagues.find((league) => league.id === leagueId) ?? null),
    [leagueId, leagues],
  );

  async function createItem() {
    if (leagueId === "") {
      setStatus("League is required");
      return;
    }

    setStatus("Saving...");
    const res = await fetch("/api/backend/api/admin/seasons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leagueId,
        name,
        description,
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: `${endDate}T23:59:59.999Z`,
      }),
    });

    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      setLeagueId(requestedLeagueId ? Number(requestedLeagueId) : "");
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      await load();
    }
  }

  async function updateItem(item: Season) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/seasons/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leagueId: item.leagueId,
        name: item.name,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
      }),
    });

    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      await load();
    }
  }

  async function deleteItem(id: number) {
    setStatus("Deleting...");
    const res = await fetch(`/api/backend/api/admin/seasons/${id}`, { method: "DELETE" });

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
            Seasons
          </CardTitle>
          <CardDescription>
            {selectedLeague
              ? `Managing seasons for ${selectedLeague.name}.`
              : "Select a league and define its season windows."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-12">
          <div className="space-y-2 md:col-span-3">
            <Label>League</Label>
            <Select
              value={leagueId === "" ? undefined : String(leagueId)}
              onValueChange={(value) => setLeagueId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose league" />
              </SelectTrigger>
              <SelectContent>
                {leagues.map((league) => (
                  <SelectItem key={league.id} value={String(league.id)}>
                    {league.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="season-name">Season name</Label>
            <Input
              id="season-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="2026 / 2027"
            />
          </div>

          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="season-start">Start date</Label>
            <Input
              id="season-start"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="season-end">End date</Label>
            <Input
              id="season-end"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-9">
            <Label htmlFor="season-description">Description</Label>
            <Input
              id="season-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Season description"
            />
          </div>

          <div className="md:col-span-3 md:self-end">
            <Button className="w-full" onClick={() => void createItem()}>
              Create season
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary">Season #{item.id}</Badge>
                <span className="text-sm text-muted-foreground">{formatSeasonLabel(item)}</span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="space-y-2 md:col-span-3">
                  <Label>League</Label>
                  <Select
                    value={String(item.leagueId)}
                    onValueChange={(value) => {
                      const parsed = Number(value);
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id
                            ? {
                                ...x,
                                leagueId: parsed,
                                league: leagues.find((league) => league.id === parsed) ?? x.league,
                              }
                            : x,
                        ),
                      );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leagues.map((league) => (
                        <SelectItem key={league.id} value={String(league.id)}>
                          {league.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label>Name</Label>
                  <Input
                    value={item.name}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((x) => (x.id === item.id ? { ...x, name: event.target.value } : x)),
                      )
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-6">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, description: event.target.value } : x,
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

                <div className="space-y-2 md:col-span-3">
                  <Label>End</Label>
                  <Input
                    type="datetime-local"
                    value={toLocalDateTime(item.endDate)}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id
                            ? { ...x, endDate: new Date(event.target.value).toISOString() }
                            : x,
                        ),
                      )
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-2 md:col-span-6 md:self-end">
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
