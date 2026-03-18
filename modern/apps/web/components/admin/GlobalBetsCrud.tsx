"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Crown, Save } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type League = { id: number; name: string };
type Season = { id: number; name: string; league: League };
type Team = { id: number; name: string };
type Player = { id: number; name: string };

type TeamInSeason = {
  id: number;
  seasonId: number;
  teamId: number;
  team: Team;
  players: Array<{ id: number; position: string; playerId: number; player: Player }>;
};

type GlobalResults = {
  id: number;
  seasonId: number;
  deadline: string;
  winterChampionId: number | null;
  kingsCupChampionId: number | null;
  leagueChampionId: number | null;
  uefaChampionId: number | null;
  championsLeagueChampionId: number | null;
  bestGoalkeeperId: number | null;
  championsPositions: Team[];
  uefaPositions: Team[];
  demotionPositions: Team[];
};

type FormState = {
  deadline: string;
  winterChampionId: number | "";
  kingsCupChampionId: number | "";
  leagueChampionId: number | "";
  uefaChampionId: number | "";
  championsLeagueChampionId: number | "";
  bestGoalkeeperId: number | "";
  championsPositionIds: number[];
  uefaPositionIds: number[];
  demotionPositionIds: number[];
};

function formatSeasonLabel(s: Season) {
  return `${s.league.name} / ${s.name}`;
}

function emptyForm(): FormState {
  return {
    deadline: "",
    winterChampionId: "",
    kingsCupChampionId: "",
    leagueChampionId: "",
    uefaChampionId: "",
    championsLeagueChampionId: "",
    bestGoalkeeperId: "",
    championsPositionIds: [],
    uefaPositionIds: [],
    demotionPositionIds: [],
  };
}

function toLocalDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function MultiSelectField({
  id,
  label,
  options,
  values,
  onChange,
}: {
  id: string;
  label: string;
  options: Team[];
  values: number[];
  onChange: (ids: number[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="h-36 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        multiple
        value={values.map(String)}
        onChange={(event) => {
          const ids = Array.from(event.target.selectedOptions).map((x) => Number(x.value));
          onChange(ids);
        }}
      >
        {options.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-muted-foreground">Use Ctrl/Cmd to pick multiple teams.</p>
    </div>
  );
}

export function GlobalBetsCrud() {
  const searchParams = useSearchParams();
  const requestedLeagueId = searchParams.get("leagueId");

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teamInSeasons, setTeamInSeasons] = useState<TeamInSeason[]>([]);
  const [globalResults, setGlobalResults] = useState<GlobalResults[]>([]);

  const [selectedSeasonId, setSelectedSeasonId] = useState<number | "">("");
  const [form, setForm] = useState<FormState>(emptyForm());
  const [status, setStatus] = useState("");

  async function load() {
    const [sRes, tisRes, grRes] = await Promise.all([
      fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/team-in-seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/global-results", { cache: "no-store" }),
    ]);

    if (sRes.ok) {
      const d = (await sRes.json()) as { seasons?: Season[] };
      setSeasons(d.seasons ?? []);
    }
    if (tisRes.ok) {
      const d = (await tisRes.json()) as { teamInSeasons?: TeamInSeason[] };
      setTeamInSeasons(d.teamInSeasons ?? []);
    }
    if (grRes.ok) {
      const d = (await grRes.json()) as { globalResults?: GlobalResults[] };
      setGlobalResults(d.globalResults ?? []);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const visibleSeasons = requestedLeagueId
    ? seasons.filter((season) => season.league.id === Number(requestedLeagueId))
    : seasons;

  useEffect(() => {
    if (!requestedLeagueId || selectedSeasonId !== "") {
      return;
    }

    const firstSeason = seasons.find((season) => season.league.id === Number(requestedLeagueId));
    if (firstSeason) {
      setSelectedSeasonId(firstSeason.id);
      loadSeasonForm(firstSeason.id);
    }
  }, [requestedLeagueId, seasons, selectedSeasonId]);

  const seasonTeams = useMemo(() => {
    if (selectedSeasonId === "") {
      return [] as Team[];
    }

    const map = new Map<number, Team>();
    for (const row of teamInSeasons) {
      if (row.seasonId === selectedSeasonId) {
        map.set(row.team.id, row.team);
      }
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [teamInSeasons, selectedSeasonId]);

  const goalkeepers = useMemo(() => {
    if (selectedSeasonId === "") {
      return [] as Player[];
    }

    const map = new Map<number, Player>();
    for (const row of teamInSeasons) {
      if (row.seasonId !== selectedSeasonId) {
        continue;
      }
      for (const entry of row.players) {
        if (entry.position === "GK") {
          map.set(entry.player.id, entry.player);
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [teamInSeasons, selectedSeasonId]);

  function loadSeasonForm(seasonId: number) {
    const current = globalResults.find((x) => x.seasonId === seasonId);
    if (!current) {
      setForm(emptyForm());
      return;
    }

    setForm({
      deadline: toLocalDateTime(current.deadline),
      winterChampionId: current.winterChampionId ?? "",
      kingsCupChampionId: current.kingsCupChampionId ?? "",
      leagueChampionId: current.leagueChampionId ?? "",
      uefaChampionId: current.uefaChampionId ?? "",
      championsLeagueChampionId: current.championsLeagueChampionId ?? "",
      bestGoalkeeperId: current.bestGoalkeeperId ?? "",
      championsPositionIds: current.championsPositions.map((x) => x.id),
      uefaPositionIds: current.uefaPositions.map((x) => x.id),
      demotionPositionIds: current.demotionPositions.map((x) => x.id),
    });
  }

  async function save() {
    if (selectedSeasonId === "" || !form.deadline) {
      setStatus("Season and deadline are required");
      return;
    }

    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/seasons/${selectedSeasonId}/global-results`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deadline: new Date(form.deadline).toISOString(),
        winterChampionId: form.winterChampionId === "" ? null : form.winterChampionId,
        kingsCupChampionId: form.kingsCupChampionId === "" ? null : form.kingsCupChampionId,
        leagueChampionId: form.leagueChampionId === "" ? null : form.leagueChampionId,
        uefaChampionId: form.uefaChampionId === "" ? null : form.uefaChampionId,
        championsLeagueChampionId:
          form.championsLeagueChampionId === "" ? null : form.championsLeagueChampionId,
        bestGoalkeeperId: form.bestGoalkeeperId === "" ? null : form.bestGoalkeeperId,
        championsPositionIds: form.championsPositionIds,
        uefaPositionIds: form.uefaPositionIds,
        demotionPositionIds: form.demotionPositionIds,
      }),
    });

    setStatus(res.ok ? "Saved" : "Save failed");
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
            <Crown className="size-5 text-primary" />
            Global Bets
          </CardTitle>
          <CardDescription>
            Configure season-wide predictions, champions, and rank outcomes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-12">
          <div className="space-y-2 md:col-span-7">
            <Label>Season</Label>
            <Select
              value={selectedSeasonId === "" ? undefined : String(selectedSeasonId)}
              onValueChange={(value) => {
                const parsed = Number(value);
                setSelectedSeasonId(parsed);
                loadSeasonForm(parsed);
              }}
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

          <div className="space-y-2 md:col-span-5">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={form.deadline}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, deadline: event.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {selectedSeasonId !== "" ? (
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Winter champion</Label>
                <Select
                  value={form.winterChampionId === "" ? undefined : String(form.winterChampionId)}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, winterChampionId: Number(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonTeams.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kings Cup champion</Label>
                <Select
                  value={form.kingsCupChampionId === "" ? undefined : String(form.kingsCupChampionId)}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, kingsCupChampionId: Number(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonTeams.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>League champion</Label>
                <Select
                  value={form.leagueChampionId === "" ? undefined : String(form.leagueChampionId)}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, leagueChampionId: Number(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonTeams.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>UEFA champion</Label>
                <Select
                  value={form.uefaChampionId === "" ? undefined : String(form.uefaChampionId)}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, uefaChampionId: Number(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonTeams.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Champions League champion</Label>
                <Select
                  value={
                    form.championsLeagueChampionId === ""
                      ? undefined
                      : String(form.championsLeagueChampionId)
                  }
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, championsLeagueChampionId: Number(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonTeams.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Best goalkeeper</Label>
                <Select
                  value={
                    form.bestGoalkeeperId === ""
                      ? undefined
                      : String(form.bestGoalkeeperId)
                  }
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, bestGoalkeeperId: Number(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goalkeeper" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalkeepers.map((player) => (
                      <SelectItem key={player.id} value={String(player.id)}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <MultiSelectField
                id="champions-positions"
                label="Champions positions"
                options={seasonTeams}
                values={form.championsPositionIds}
                onChange={(ids) => setForm((prev) => ({ ...prev, championsPositionIds: ids }))}
              />
              <MultiSelectField
                id="uefa-positions"
                label="UEFA positions"
                options={seasonTeams}
                values={form.uefaPositionIds}
                onChange={(ids) => setForm((prev) => ({ ...prev, uefaPositionIds: ids }))}
              />
              <MultiSelectField
                id="demotion-positions"
                label="Demotion positions"
                options={seasonTeams}
                values={form.demotionPositionIds}
                onChange={(ids) => setForm((prev) => ({ ...prev, demotionPositionIds: ids }))}
              />
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
              <Badge variant="secondary">Season #{selectedSeasonId}</Badge>
              <Button onClick={() => void save()}>
                <Save className="mr-2 size-4" />
                Save global bets
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {status ? (
        <Alert variant={isError ? "destructive" : "default"}>
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      ) : null}
    </section>
  );
}
