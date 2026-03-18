"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Save, Shield, Trash2, UserPlus, Users } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type League = { id: number; name: string };
type Season = { id: number; name: string; league: League };
type Team = { id: number; name: string };
type Player = { id: number; name: string };
type PlayerEntry = { id: number; playerId: number; position: string; player: Player };
type TeamInSeason = {
  id: number;
  teamId: number;
  seasonId: number;
  spanishLeague: boolean;
  uefaLeague: boolean;
  championsLeague: boolean;
  kingsCup: boolean;
  team: Team;
  season: Season;
  players: PlayerEntry[];
};

const POSITIONS = ["GK", "DF", "MF", "FW"] as const;

function formatSeasonLabel(season: Season) {
  return `${season.league.name} / ${season.name}`;
}

export function SquadCrud() {
  const searchParams = useSearchParams();
  const requestedLeagueId = searchParams.get("leagueId");

  const [teamInSeasons, setTeamInSeasons] = useState<TeamInSeason[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  const [selectedSeasonId, setSelectedSeasonId] = useState<number | "">("");
  const [enrollTeamId, setEnrollTeamId] = useState<number | "">("");
  const [status, setStatus] = useState("");

  const [addState, setAddState] = useState<Record<number, { playerIds: number[]; position: string }>>({});
  const [teamFlagsState, setTeamFlagsState] = useState<
    Record<
      number,
      {
        spanishLeague: boolean;
        uefaLeague: boolean;
        championsLeague: boolean;
        kingsCup: boolean;
      }
    >
  >({});
  const [playerPositionState, setPlayerPositionState] = useState<Record<number, string>>({});

  async function load() {
    const [tisRes, playersRes, seasonsRes, teamsRes] = await Promise.all([
      fetch("/api/backend/api/admin/team-in-seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/players", { cache: "no-store" }),
      fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/teams", { cache: "no-store" }),
    ]);

    if (tisRes.ok) {
      const payload = (await tisRes.json()) as { teamInSeasons?: TeamInSeason[] };
      setTeamInSeasons(payload.teamInSeasons ?? []);
    }
    if (playersRes.ok) {
      const payload = (await playersRes.json()) as { players?: Player[] };
      setAllPlayers(payload.players ?? []);
    }
    if (seasonsRes.ok) {
      const payload = (await seasonsRes.json()) as { seasons?: Season[] };
      setSeasons((payload.seasons ?? []).sort((a, b) => b.id - a.id));
    }
    if (teamsRes.ok) {
      const payload = (await teamsRes.json()) as { teams?: Team[] };
      setAllTeams(payload.teams ?? []);
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
    }
  }, [requestedLeagueId, seasons, selectedSeasonId]);

  const visibleTeams = useMemo(
    () =>
      selectedSeasonId === ""
        ? []
        : teamInSeasons.filter((teamInSeason) => teamInSeason.seasonId === selectedSeasonId),
    [selectedSeasonId, teamInSeasons],
  );

  const enrolledTeamIds = new Set(visibleTeams.map((teamInSeason) => teamInSeason.teamId));
  const availableToEnroll = allTeams.filter((team) => !enrolledTeamIds.has(team.id));

  async function enrollTeam() {
    if (selectedSeasonId === "" || enrollTeamId === "") {
      return;
    }

    setStatus("Enrolling...");
    const res = await fetch(`/api/backend/api/admin/seasons/${selectedSeasonId}/teams/${enrollTeamId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    setStatus(res.ok ? "Team enrolled" : "Enroll failed");
    if (res.ok) {
      setEnrollTeamId("");
      await load();
    }
  }

  async function removeTeam(teamInSeasonId: number) {
    setStatus("Removing team...");
    const res = await fetch(`/api/backend/api/admin/team-in-seasons/${teamInSeasonId}`, {
      method: "DELETE",
    });

    setStatus(res.ok ? "Removed" : "Remove failed");
    if (res.ok) {
      await load();
    }
  }

  function getTeamFlags(teamInSeason: TeamInSeason) {
    return (
      teamFlagsState[teamInSeason.id] ?? {
        spanishLeague: teamInSeason.spanishLeague,
        uefaLeague: teamInSeason.uefaLeague,
        championsLeague: teamInSeason.championsLeague,
        kingsCup: teamInSeason.kingsCup,
      }
    );
  }

  function setTeamFlag(
    teamInSeasonId: number,
    key: "spanishLeague" | "uefaLeague" | "championsLeague" | "kingsCup",
    value: boolean,
  ) {
    setTeamFlagsState((prev) => ({
      ...prev,
      [teamInSeasonId]: {
        ...(prev[teamInSeasonId] ?? {
          spanishLeague: true,
          uefaLeague: false,
          championsLeague: false,
          kingsCup: false,
        }),
        [key]: value,
      },
    }));
  }

  async function saveTeamFlags(teamInSeason: TeamInSeason) {
    const flags = getTeamFlags(teamInSeason);
    setStatus("Saving team settings...");

    const res = await fetch(
      `/api/backend/api/admin/seasons/${teamInSeason.seasonId}/teams/${teamInSeason.teamId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flags),
      },
    );

    setStatus(res.ok ? "Team settings saved" : "Save failed");
    if (res.ok) {
      setTeamFlagsState((prev) => {
        const next = { ...prev };
        delete next[teamInSeason.id];
        return next;
      });
      await load();
    }
  }

  function getAddForm(teamInSeasonId: number) {
    return addState[teamInSeasonId] ?? { playerIds: [], position: "GK" };
  }

  function setAddField(teamInSeasonId: number, field: "playerIds" | "position", value: number[] | string) {
    setAddState((prev) => ({
      ...prev,
      [teamInSeasonId]: { ...getAddForm(teamInSeasonId), [field]: value },
    }));
  }

  async function assign(teamInSeason: TeamInSeason) {
    const form = getAddForm(teamInSeason.id);
    if (form.playerIds.length === 0) {
      return;
    }

    setStatus("Saving...");
    const responses = await Promise.all(
      form.playerIds.map((playerId) =>
        fetch(`/api/backend/api/admin/team-in-seasons/${teamInSeason.id}/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, position: form.position }),
        }),
      ),
    );

    const ok = responses.every((response) => response.ok);
    setStatus(ok ? "Saved" : "Save failed");
    if (ok) {
      setAddState((prev) => ({ ...prev, [teamInSeason.id]: { playerIds: [], position: "GK" } }));
      await load();
    }
  }

  async function removePlayer(teamInSeasonId: number, playerId: number) {
    setStatus("Removing...");
    const res = await fetch(`/api/backend/api/admin/team-in-seasons/${teamInSeasonId}/players/${playerId}`, {
      method: "DELETE",
    });

    setStatus(res.ok ? "Removed" : "Remove failed");
    if (res.ok) {
      await load();
    }
  }

  function getPlayerPosition(entry: PlayerEntry) {
    return playerPositionState[entry.id] ?? entry.position;
  }

  async function savePlayerPosition(teamInSeason: TeamInSeason, entry: PlayerEntry) {
    const position = getPlayerPosition(entry);
    setStatus("Saving player position...");

    const res = await fetch(`/api/backend/api/admin/team-in-seasons/${teamInSeason.id}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: entry.playerId, position }),
    });

    setStatus(res.ok ? "Player updated" : "Save failed");
    if (res.ok) {
      setPlayerPositionState((prev) => {
        const next = { ...prev };
        delete next[entry.id];
        return next;
      });
      await load();
    }
  }

  const isError = status.toLowerCase().includes("failed");

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            Squad Assignment
          </CardTitle>
          <CardDescription>
            Select a season and manage enrolled teams with player assignments.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-12">
          <div className="space-y-2 md:col-span-8">
            <Label>Season</Label>
            <Select
              value={selectedSeasonId === "" ? undefined : String(selectedSeasonId)}
              onValueChange={(value) => {
                setSelectedSeasonId(Number(value));
                setEnrollTeamId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pick a season" />
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

          {selectedSeasonId !== "" ? (
            <>
              <div className="space-y-2 md:col-span-8">
                <Label>Add team to season</Label>
                <Select
                  value={enrollTeamId === "" ? undefined : String(enrollTeamId)}
                  onValueChange={(value) => setEnrollTeamId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableToEnroll.map((team) => (
                      <SelectItem key={team.id} value={String(team.id)}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4 md:self-end">
                <Button className="w-full" disabled={enrollTeamId === ""} onClick={() => void enrollTeam()}>
                  <UserPlus className="mr-2 size-4" />
                  Add team
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {visibleTeams.map((teamInSeason) => {
          const form = getAddForm(teamInSeason.id);
          const flags = getTeamFlags(teamInSeason);
          const assignedIds = new Set(teamInSeason.players.map((entry) => entry.playerId));
          const available = allPlayers.filter((player) => !assignedIds.has(player.id));

          return (
            <Card key={teamInSeason.id}>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-base">{teamInSeason.team.name}</CardTitle>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => void removeTeam(teamInSeason.id)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove team
                  </Button>
                </div>
                <Badge variant="secondary">Team in season #{teamInSeason.id}</Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <label className="flex items-center gap-2 rounded-md border border-border p-2 text-sm">
                    <Checkbox
                      checked={flags.spanishLeague}
                      onCheckedChange={(checked) =>
                        setTeamFlag(teamInSeason.id, "spanishLeague", checked === true)
                      }
                    />
                    <span>Spanish League</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border border-border p-2 text-sm">
                    <Checkbox
                      checked={flags.uefaLeague}
                      onCheckedChange={(checked) =>
                        setTeamFlag(teamInSeason.id, "uefaLeague", checked === true)
                      }
                    />
                    <span>UEFA League</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border border-border p-2 text-sm">
                    <Checkbox
                      checked={flags.championsLeague}
                      onCheckedChange={(checked) =>
                        setTeamFlag(teamInSeason.id, "championsLeague", checked === true)
                      }
                    />
                    <span>Champions League</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border border-border p-2 text-sm">
                    <Checkbox
                      checked={flags.kingsCup}
                      onCheckedChange={(checked) =>
                        setTeamFlag(teamInSeason.id, "kingsCup", checked === true)
                      }
                    />
                    <span>Kings Cup</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button variant="secondary" onClick={() => void saveTeamFlags(teamInSeason)}>
                    <Shield className="mr-2 size-4" />
                    Save team settings
                  </Button>
                </div>

                {teamInSeason.players.length > 0 ? (
                  <div className="overflow-x-auto rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Player</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamInSeason.players.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.player.name}</TableCell>
                            <TableCell>
                              <Select
                                value={getPlayerPosition(entry)}
                                onValueChange={(value) =>
                                  setPlayerPositionState((prev) => ({ ...prev, [entry.id]: value }))
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {POSITIONS.map((position) => (
                                    <SelectItem key={position} value={position}>
                                      {position}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => void savePlayerPosition(teamInSeason, entry)}
                                >
                                  <Save className="mr-2 size-4" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => void removePlayer(teamInSeason.id, entry.playerId)}
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Remove
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No players assigned yet.</p>
                )}

                {available.length > 0 ? (
                  <div className="grid gap-3 rounded-md border border-border p-3 md:grid-cols-12">
                    <div className="space-y-2 md:col-span-7">
                      <Label>Available players</Label>
                      <select
                        className="h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        multiple
                        value={form.playerIds.map(String)}
                        onChange={(event) => {
                          const selected = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
                          setAddField(teamInSeason.id, "playerIds", selected);
                        }}
                      >
                        {available.map((player) => (
                          <option key={player.id} value={player.id}>
                            {player.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-muted-foreground">Use Ctrl/Cmd to choose multiple players.</p>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Position</Label>
                      <Select
                        value={form.position}
                        onValueChange={(value) => setAddField(teamInSeason.id, "position", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITIONS.map((position) => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-3 md:self-end">
                      <Button
                        className="w-full"
                        disabled={form.playerIds.length === 0}
                        onClick={() => void assign(teamInSeason)}
                      >
                        Assign selected
                      </Button>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
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
