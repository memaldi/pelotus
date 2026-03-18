"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Save, Swords, Trash2 } from "lucide-react";
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

type Team = {
  id: number;
  name: string;
};

type MatchDay = {
  id: number;
  seasonId: number;
  number: number;
  season: { id: number; leagueId: number; name: string; league: { id: number; name: string } };
};

type Match = {
  id: number;
  matchDayId: number;
  homeTeamId: number;
  foreignTeamId: number;
  homeGoals: number | null;
  foreignGoals: number | null;
  matchDay: { number: number };
  homeTeam: { name: string };
  foreignTeam: { name: string };
};

export function MatchesCrud() {
  const searchParams = useSearchParams();
  const requestedLeagueId = searchParams.get("leagueId");

  const [items, setItems] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matchDays, setMatchDays] = useState<MatchDay[]>([]);
  const [status, setStatus] = useState("");

  const [matchDayId, setMatchDayId] = useState<number | "">("");
  const [homeTeamId, setHomeTeamId] = useState<number | "">("");
  const [foreignTeamId, setForeignTeamId] = useState<number | "">("");
  const [homeGoals, setHomeGoals] = useState<number | "">("");
  const [foreignGoals, setForeignGoals] = useState<number | "">("");

  function formatMatchDayLabel(matchDay: MatchDay) {
    return `MD${matchDay.number} (${matchDay.season.league.name} / ${matchDay.season.name})`;
  }

  async function load() {
    const [matchesRes, teamsRes, matchDaysRes] = await Promise.all([
      fetch("/api/backend/api/admin/matches", { cache: "no-store" }),
      fetch("/api/backend/api/admin/teams", { cache: "no-store" }),
      fetch("/api/backend/api/admin/match-days", { cache: "no-store" }),
    ]);

    if (!matchesRes.ok || !teamsRes.ok || !matchDaysRes.ok) {
      setStatus("Failed to load matches context");
      return;
    }

    const matchesPayload = (await matchesRes.json()) as { matches?: Match[] };
    const teamsPayload = (await teamsRes.json()) as { teams?: Team[] };
    const matchDaysPayload = (await matchDaysRes.json()) as { matchDays?: MatchDay[] };

    setItems(matchesPayload.matches ?? []);
    setTeams(teamsPayload.teams ?? []);
    setMatchDays(matchDaysPayload.matchDays ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const visibleMatchDays = requestedLeagueId
    ? matchDays.filter((matchDay) => matchDay.season.leagueId === Number(requestedLeagueId))
    : matchDays;

  const filteredMatchDayIds = new Set(visibleMatchDays.map((matchDay) => matchDay.id));
  const filteredItems = requestedLeagueId ? items.filter((item) => filteredMatchDayIds.has(item.matchDayId)) : items;

  useEffect(() => {
    if (!requestedLeagueId || matchDayId !== "") {
      return;
    }

    const firstMatchDay = visibleMatchDays[0];
    if (firstMatchDay) {
      setMatchDayId(firstMatchDay.id);
    }
  }, [requestedLeagueId, visibleMatchDays, matchDayId]);

  async function createItem() {
    if (matchDayId === "" || homeTeamId === "" || foreignTeamId === "") {
      setStatus("Match day and both teams are required");
      return;
    }

    setStatus("Saving...");
    const res = await fetch("/api/backend/api/admin/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchDayId,
        homeTeamId,
        foreignTeamId,
        homeGoals: homeGoals === "" ? null : homeGoals,
        foreignGoals: foreignGoals === "" ? null : foreignGoals,
      }),
    });

    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      setMatchDayId(requestedLeagueId && visibleMatchDays[0] ? visibleMatchDays[0].id : "");
      setHomeTeamId("");
      setForeignTeamId("");
      setHomeGoals("");
      setForeignGoals("");
      await load();
    }
  }

  async function updateItem(item: Match) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/matches/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchDayId: item.matchDayId,
        homeTeamId: item.homeTeamId,
        foreignTeamId: item.foreignTeamId,
        homeGoals: item.homeGoals,
        foreignGoals: item.foreignGoals,
      }),
    });

    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      await load();
    }
  }

  async function deleteItem(id: number) {
    setStatus("Deleting...");
    const res = await fetch(`/api/backend/api/admin/matches/${id}`, { method: "DELETE" });

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
            <Swords className="size-5 text-primary" />
            Matches
          </CardTitle>
          <CardDescription>
            {requestedLeagueId
              ? "Managing matches inside the selected league."
              : "Create and edit scheduled matches by match day."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-12">
          <div className="space-y-2 md:col-span-4">
            <Label>Match day</Label>
            <Select
              value={matchDayId === "" ? undefined : String(matchDayId)}
              onValueChange={(value) => setMatchDayId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose match day" />
              </SelectTrigger>
              <SelectContent>
                {(requestedLeagueId ? visibleMatchDays : matchDays).map((matchDay) => (
                  <SelectItem key={matchDay.id} value={String(matchDay.id)}>
                    {formatMatchDayLabel(matchDay)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Home team</Label>
            <Select
              value={homeTeamId === "" ? undefined : String(homeTeamId)}
              onValueChange={(value) => setHomeTeamId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Home" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={String(team.id)}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Away team</Label>
            <Select
              value={foreignTeamId === "" ? undefined : String(foreignTeamId)}
              onValueChange={(value) => setForeignTeamId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Away" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={String(team.id)}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="create-home-goals">Home</Label>
            <Input
              id="create-home-goals"
              type="number"
              value={homeGoals}
              onChange={(event) =>
                setHomeGoals(event.target.value === "" ? "" : Number(event.target.value))
              }
              placeholder="0"
            />
          </div>

          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="create-away-goals">Away</Label>
            <Input
              id="create-away-goals"
              type="number"
              value={foreignGoals}
              onChange={(event) =>
                setForeignGoals(event.target.value === "" ? "" : Number(event.target.value))
              }
              placeholder="0"
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
                <Badge variant="secondary">Match #{item.id}</Badge>
                <span className="text-sm text-muted-foreground">
                  {item.homeTeam.name} vs {item.foreignTeam.name} · MD {item.matchDay.number}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="space-y-2 md:col-span-4">
                  <Label>Match day</Label>
                  <Select
                    value={String(item.matchDayId)}
                    onValueChange={(value) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, matchDayId: Number(value) } : x,
                        ),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(requestedLeagueId ? visibleMatchDays : matchDays).map((matchDay) => (
                        <SelectItem key={matchDay.id} value={String(matchDay.id)}>
                          {formatMatchDayLabel(matchDay)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Home team</Label>
                  <Select
                    value={String(item.homeTeamId)}
                    onValueChange={(value) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, homeTeamId: Number(value) } : x,
                        ),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={String(team.id)}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Away team</Label>
                  <Select
                    value={String(item.foreignTeamId)}
                    onValueChange={(value) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, foreignTeamId: Number(value) } : x,
                        ),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={String(team.id)}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label>Home</Label>
                  <Input
                    type="number"
                    value={item.homeGoals ?? ""}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id
                            ? {
                                ...x,
                                homeGoals:
                                  event.target.value === "" ? null : Number(event.target.value),
                              }
                            : x,
                        ),
                      )
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label>Away</Label>
                  <Input
                    type="number"
                    value={item.foreignGoals ?? ""}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id
                            ? {
                                ...x,
                                foreignGoals:
                                  event.target.value === "" ? null : Number(event.target.value),
                              }
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
