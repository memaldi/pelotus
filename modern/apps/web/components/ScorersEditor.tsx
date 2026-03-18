"use client";

import { useState } from "react";
import { Shield, Target, Zap, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Candidate = { id: number; name: string };

type Props = {
  competitionId: number;
  matchDayId: number;
  candidates: {
    defenders: Candidate[];
    midfielders: Candidate[];
    forwards: Candidate[];
  };
  initial: {
    defenseId: number | null;
    midfieldId: number | null;
    forwardId: number | null;
  } | null;
  deadlinePassed: boolean;
};

const POSITIONS = [
  { key: "defense", label: "Defender", icon: Shield, multiplier: "×5", color: "text-blue-500" },
  { key: "midfield", label: "Midfielder", icon: Zap, multiplier: "×3", color: "text-amber-500" },
  { key: "forward", label: "Forward", icon: Target, multiplier: "×1", color: "text-red-500" },
] as const;

export function ScorersEditor({ competitionId, matchDayId, candidates, initial, deadlinePassed }: Props) {
  const [defenseId, setDefenseId] = useState<string>(initial?.defenseId ? String(initial.defenseId) : "");
  const [midfieldId, setMidfieldId] = useState<string>(initial?.midfieldId ? String(initial.midfieldId) : "");
  const [forwardId, setForwardId] = useState<string>(initial?.forwardId ? String(initial.forwardId) : "");
  const [status, setStatus] = useState("");

  const candidateMap = {
    defense: candidates.defenders,
    midfield: candidates.midfielders,
    forward: candidates.forwards,
  };
  const valueMap = { defense: defenseId, midfield: midfieldId, forward: forwardId };
  const setterMap = { defense: setDefenseId, midfield: setMidfieldId, forward: setForwardId };

  async function save() {
    setStatus("Saving...");
    const res = await fetch(
      `/api/backend/api/competitions/${competitionId}/match-days/${matchDayId}/scorers`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defenseId: defenseId ? Number(defenseId) : null,
          midfieldId: midfieldId ? Number(midfieldId) : null,
          forwardId: forwardId ? Number(forwardId) : null,
        }),
      },
    );
    setStatus(res.ok ? "Scorer picks saved" : "Failed to save picks");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Scorer Picks</span>
          {deadlinePassed && <Badge variant="destructive">Deadline passed — read only</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Pick one player per position who you think will score. Goals count: defender ×5 pts, midfielder ×3 pts, forward ×1 pt.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {POSITIONS.map(({ key, label, icon: Icon, multiplier, color }) => (
            <div key={key} className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Icon className={`size-4 ${color}`} />
                {label}
                <span className="ml-auto text-xs text-muted-foreground">{multiplier}</span>
              </Label>
              <Select
                value={valueMap[key]}
                onValueChange={setterMap[key]}
                disabled={deadlinePassed}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pick player..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— none —</SelectItem>
                  {candidateMap[key].map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {!deadlinePassed && (
          <Button onClick={save} disabled={status === "Saving..."} className="w-full sm:w-auto">
            <Save className="mr-2 size-4" />
            {status === "Saving..." ? "Saving..." : "Save picks"}
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
