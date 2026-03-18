"use client";

import { useState } from "react";
import { Save, Trophy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Team = { id: number; name: string };
type Player = { id: number; name: string };

type Props = {
  competitionId: number;
  teams: { spanishLeague: Team[]; kingsCup: Team[]; uefa: Team[]; champions: Team[] };
  goalkeepers: Player[];
  initial: {
    winterChampionId?: number | null;
    kingsCupChampionId?: number | null;
    leagueChampionId?: number | null;
    uefaChampionId?: number | null;
    championsLeagueChampionId?: number | null;
    bestGoalkeeperId?: number | null;
    championsPositions?: Team[];
    uefaPositions?: Team[];
    demotionPositions?: Team[];
  } | null;
  deadlinePassed: boolean;
};

function TeamSelect({
  value,
  options,
  onChange,
  disabled,
  placeholder,
}: {
  value: string;
  options: Team[];
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">— none —</SelectItem>
        {options.map((t) => (
          <SelectItem key={t.id} value={String(t.id)}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function toId(v: string): number | null {
  return v && v !== "none" ? Number(v) : null;
}

const DEMOTION_SLOTS = 3;
const UEFA_SLOTS = 2;
const CHAMPIONS_SLOTS = 4;

export function GlobalBetEditor({ competitionId, teams, goalkeepers, initial, deadlinePassed }: Props) {
  const [status, setStatus] = useState("");
  const s = (v: number | null | undefined) => (v ? String(v) : "");

  const [winterChampionId, setWinterChampionId] = useState(s(initial?.winterChampionId));
  const [leagueChampionId, setLeagueChampionId] = useState(s(initial?.leagueChampionId));
  const [kingsCupChampionId, setKingsCupChampionId] = useState(s(initial?.kingsCupChampionId));
  const [uefaChampionId, setUefaChampionId] = useState(s(initial?.uefaChampionId));
  const [championsLeagueChampionId, setChampionsLeagueChampionId] = useState(s(initial?.championsLeagueChampionId));
  const [bestGoalkeeperId, setBestGoalkeeperId] = useState(s(initial?.bestGoalkeeperId));

  // Ordered position arrays
  const initChampions = initial?.championsPositions?.map((t) => String(t.id)) ?? [];
  const initUefa = initial?.uefaPositions?.map((t) => String(t.id)) ?? [];
  const initDemotion = initial?.demotionPositions?.map((t) => String(t.id)) ?? [];
  const [championsPositions, setChampionsPositions] = useState<string[]>(
    [...initChampions, ...Array(CHAMPIONS_SLOTS).fill("")].slice(0, CHAMPIONS_SLOTS),
  );
  const [uefaPositions, setUefaPositions] = useState<string[]>(
    [...initUefa, ...Array(UEFA_SLOTS).fill("")].slice(0, UEFA_SLOTS),
  );
  const [demotionPositions, setDemotionPositions] = useState<string[]>(
    [...initDemotion, ...Array(DEMOTION_SLOTS).fill("")].slice(0, DEMOTION_SLOTS),
  );

  function setPositionSlot(arr: string[], setArr: (v: string[]) => void, idx: number, val: string) {
    const next = [...arr];
    next[idx] = val;
    setArr(next);
  }

  async function save() {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/competitions/${competitionId}/global-bets`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        winterChampionId: toId(winterChampionId),
        kingsCupChampionId: toId(kingsCupChampionId),
        leagueChampionId: toId(leagueChampionId),
        uefaChampionId: toId(uefaChampionId),
        championsLeagueChampionId: toId(championsLeagueChampionId),
        bestGoalkeeperId: toId(bestGoalkeeperId),
        championsPositionIds: championsPositions.map(toId).filter(Boolean) as number[],
        uefaPositionIds: uefaPositions.map(toId).filter(Boolean) as number[],
        demotionPositionIds: demotionPositions.map(toId).filter(Boolean) as number[],
      }),
    });
    setStatus(res.ok ? "Global bet saved" : "Failed to save");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            Global Bet
          </span>
          {deadlinePassed && <Badge variant="destructive">Deadline passed — read only</Badge>}
        </CardTitle>
        <CardDescription>
          Predict season outcomes. Each correct answer is worth +10 pts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Champions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Spanish League</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Winter Champion</Label>
              <TeamSelect value={winterChampionId} options={teams.spanishLeague} onChange={setWinterChampionId} disabled={deadlinePassed} placeholder="Pick team..." />
            </div>
            <div className="space-y-1.5">
              <Label>League Champion</Label>
              <TeamSelect value={leagueChampionId} options={teams.spanishLeague} onChange={setLeagueChampionId} disabled={deadlinePassed} placeholder="Pick team..." />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Cup Competitions</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>King's Cup Champion</Label>
              <TeamSelect value={kingsCupChampionId} options={teams.kingsCup} onChange={setKingsCupChampionId} disabled={deadlinePassed} placeholder="Pick team..." />
            </div>
            <div className="space-y-1.5">
              <Label>UEFA Champion</Label>
              <TeamSelect value={uefaChampionId} options={teams.uefa} onChange={setUefaChampionId} disabled={deadlinePassed} placeholder="Pick team..." />
            </div>
            <div className="space-y-1.5">
              <Label>Champions League Champion</Label>
              <TeamSelect value={championsLeagueChampionId} options={teams.champions} onChange={setChampionsLeagueChampionId} disabled={deadlinePassed} placeholder="Pick team..." />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Best Goalkeeper</h3>
          <div className="max-w-xs space-y-1.5">
            <Label>Goalkeeper</Label>
            <Select value={bestGoalkeeperId} onValueChange={setBestGoalkeeperId} disabled={deadlinePassed}>
              <SelectTrigger><SelectValue placeholder="Pick goalkeeper..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— none —</SelectItem>
                {goalkeepers.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Champions League Positions (1–{CHAMPIONS_SLOTS})</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {championsPositions.map((val, i) => (
              <div key={i} className="space-y-1.5">
                <Label>Position {i + 1}</Label>
                <TeamSelect
                  value={val}
                  options={teams.champions}
                  onChange={(v) => setPositionSlot(championsPositions, setChampionsPositions, i, v)}
                  disabled={deadlinePassed}
                  placeholder="Pick team..."
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">UEFA League Positions (1–{UEFA_SLOTS})</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {uefaPositions.map((val, i) => (
              <div key={i} className="space-y-1.5">
                <Label>Position {i + 1}</Label>
                <TeamSelect
                  value={val}
                  options={teams.uefa}
                  onChange={(v) => setPositionSlot(uefaPositions, setUefaPositions, i, v)}
                  disabled={deadlinePassed}
                  placeholder="Pick team..."
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Demotion Positions (1–{DEMOTION_SLOTS})</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {demotionPositions.map((val, i) => (
              <div key={i} className="space-y-1.5">
                <Label>Position {i + 1}</Label>
                <TeamSelect
                  value={val}
                  options={teams.spanishLeague}
                  onChange={(v) => setPositionSlot(demotionPositions, setDemotionPositions, i, v)}
                  disabled={deadlinePassed}
                  placeholder="Pick team..."
                />
              </div>
            ))}
          </div>
        </div>

        {!deadlinePassed && (
          <Button onClick={save} disabled={status === "Saving..."} className="w-full sm:w-auto">
            <Save className="mr-2 size-4" />
            {status === "Saving..." ? "Saving..." : "Save global bet"}
          </Button>
        )}

        {status && status !== "Saving..." && (
          <Alert variant={status.includes("Failed") ? "destructive" : "default"}>
            <AlertDescription>{status}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
