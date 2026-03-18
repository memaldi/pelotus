"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Season = {
  id: number;
  name: string;
  league: { name: string };
};

type MatchDay = {
  id: number;
  number: number;
  season: { name: string; league: { name: string } };
};

type Player = {
  id: number;
  name: string;
};

type PlayerGoal = {
  id: number;
  playerId: number;
  matchDayId: number;
  goals: number;
  player: Player;
  matchDay: MatchDay;
};

type BootstrapData = {
  seasons: Season[];
  matchDays: MatchDay[];
  players: Player[];
};

export function PlayerGoalsCrud() {
  const [data, setData] = useState<BootstrapData | null>(null);
  const [playerGoals, setPlayerGoals] = useState<PlayerGoal[]>([]);
  const [status, setStatus] = useState("");

  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
  const [selectedMatchDayId, setSelectedMatchDayId] = useState<string>("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [goalsValue, setGoalsValue] = useState<string>("");

  async function load() {
    const res = await fetch("/api/backend/api/admin/bootstrap", { cache: "no-store" });
    if (!res.ok) {
      setStatus("Failed loading admin data");
      return;
    }

    const payload = (await res.json()) as BootstrapData;
    setData(payload);

    // Load player goals for first match day if available
    if (payload.matchDays.length > 0) {
      await loadPlayerGoals(payload.matchDays[0].id);
    }
  }

  async function loadPlayerGoals(matchDayId: number) {
    try {
      const res = await fetch(
        `/api/backend/api/admin/match-days/${matchDayId}/player-goals`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        setPlayerGoals([]);
        return;
      }
      const payload = (await res.json()) as { playerGoals?: PlayerGoal[] };
      setPlayerGoals(payload.playerGoals ?? []);
    } catch {
      setPlayerGoals([]);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (selectedMatchDayId) {
      void loadPlayerGoals(Number(selectedMatchDayId));
    }
  }, [selectedMatchDayId]);

  async function savePlayerGoal() {
    if (!selectedMatchDayId || !selectedPlayerId || goalsValue === "") {
      setStatus("Please fill all fields");
      return;
    }

    setStatus("Saving...");
    const res = await fetch(
      `/api/backend/api/admin/match-days/${selectedMatchDayId}/player-goals`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: Number(selectedPlayerId),
          goals: Number(goalsValue),
        }),
      }
    );

    if (res.ok) {
      setStatus("Saved");
      setSelectedPlayerId("");
      setGoalsValue("");
      await loadPlayerGoals(Number(selectedMatchDayId));
    } else {
      setStatus("Save failed");
    }
  }

  async function deletePlayerGoal(playerGoalId: number) {
    if (!confirm("Delete this player goal record?")) return;

    setStatus("Deleting...");
    const res = await fetch(
      `/api/backend/api/admin/player-goals/${playerGoalId}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      setStatus("Deleted");
      if (selectedMatchDayId) {
        await loadPlayerGoals(Number(selectedMatchDayId));
      }
    } else {
      setStatus("Delete failed");
    }
  }

  const filteredMatchDays = selectedSeasonId
    ? data?.matchDays.filter((md) => md.season.name === data.seasons.find((s) => String(s.id) === selectedSeasonId)?.name)
    : data?.matchDays ?? [];

  const isError = status.toLowerCase().includes("failed");

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-5 text-primary" />
            Player Goals per Match Day
          </CardTitle>
          <CardDescription>
            Set the number of goals each player scored in a specific match day. These are actual results used for scoring user predictions.
          </CardDescription>
        </CardHeader>
      </Card>

      {status && (
        <Alert variant={isError ? "destructive" : "default"}>
          <AlertTitle>{isError ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Player Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="season-select">Season</Label>
              <Select value={selectedSeasonId} onValueChange={setSelectedSeasonId}>
                <SelectTrigger id="season-select">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {data?.seasons.map((season) => (
                    <SelectItem key={season.id} value={String(season.id)}>
                      {season.league.name} / {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="matchday-select">Match Day</Label>
              <Select value={selectedMatchDayId} onValueChange={setSelectedMatchDayId}>
                <SelectTrigger id="matchday-select">
                  <SelectValue placeholder="Select match day" />
                </SelectTrigger>
                <SelectContent>
                  {(filteredMatchDays ?? []).map((md) => (
                    <SelectItem key={md.id} value={String(md.id)}>
                      MD{md.number} - {md.season.league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="player-select">Player</Label>
              <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                <SelectTrigger id="player-select">
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {data?.players.map((player) => (
                    <SelectItem key={player.id} value={String(player.id)}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals-input">Goals</Label>
              <Input
                id="goals-input"
                type="number"
                value={goalsValue}
                onChange={(e) =>
                  setGoalsValue(e.target.value === "" ? "" : String(Number(e.target.value)))
                }
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <Button onClick={() => void savePlayerGoal()} className="w-full md:w-auto">
            <Save className="mr-2 size-4" />
            Save Player Goals
          </Button>
        </CardContent>
      </Card>

      {selectedMatchDayId && playerGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goals in Selected Match Day</CardTitle>
            <CardDescription>
              {playerGoals.length} player{playerGoals.length !== 1 ? "s" : ""} with goals recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player Name</TableHead>
                  <TableHead className="text-right">Goals</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playerGoals.map((pg) => (
                  <TableRow key={pg.id}>
                    <TableCell className="font-medium">{pg.player.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge>{pg.goals}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void deletePlayerGoal(pg.id)}
                      >
                        <Trash className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
