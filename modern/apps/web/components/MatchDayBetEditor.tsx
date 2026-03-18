"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type BetRow = {
  matchId: number;
  homeTeam: string;
  foreignTeam: string;
  userBet: { homeGoals: number | null; foreignGoals: number | null };
  realResult: { homeGoals: number | null; foreignGoals: number | null };
};

type Props = {
  competitionId: number;
  matchDayId: number;
  initialBets: BetRow[];
  deadlinePassed: boolean;
};

function resultBadge(bet: BetRow) {
  const rh = bet.realResult.homeGoals;
  const rf = bet.realResult.foreignGoals;
  const bh = bet.userBet.homeGoals;
  const bf = bet.userBet.foreignGoals;
  if (rh === null || rf === null) return null;
  if (bh === rh && bf === rf) return <Badge className="bg-green-500 text-white">Exact</Badge>;
  if (rh !== null && rf !== null && bh !== null && bf !== null) {
    const realSign = Math.sign(rh - rf);
    const betSign = Math.sign(bh - bf);
    if (realSign === betSign) return <Badge variant="secondary">Sign ✓</Badge>;
  }
  return <Badge variant="destructive">Miss</Badge>;
}

export function MatchDayBetEditor({
  competitionId,
  matchDayId,
  initialBets,
  deadlinePassed,
}: Props) {
  const [bets, setBets] = useState(initialBets);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function setValue(matchId: number, field: "homeGoals" | "foreignGoals", value: string) {
    const parsed = value.trim() === "" ? null : Number(value);
    setBets((prev) =>
      prev.map((b) =>
        b.matchId === matchId
          ? { ...b, userBet: { ...b.userBet, [field]: Number.isNaN(parsed) ? null : parsed } }
          : b,
      ),
    );
  }

  async function onSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/backend/api/competitions/${competitionId}/match-days/${matchDayId}/bets`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bets: bets.map((b) => ({
              matchId: b.matchId,
              homeGoals: b.userBet.homeGoals,
              foreignGoals: b.userBet.foreignGoals,
            })),
          }),
        },
      );
      setMessage(res.ok ? "Bets saved successfully" : "Failed to save bets");
    } catch {
      setMessage("Failed to save bets");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Match Bets</span>
          {deadlinePassed && (
            <Badge variant="destructive">Deadline passed — read only</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {bets.map((bet) => {
          const hasResult = bet.realResult.homeGoals !== null;
          return (
            <div
              key={bet.matchId}
              className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium">
                {bet.homeTeam} <span className="text-muted-foreground">vs</span> {bet.foreignTeam}
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={bet.userBet.homeGoals ?? ""}
                  onChange={(e) => setValue(bet.matchId, "homeGoals", e.target.value)}
                  disabled={deadlinePassed}
                  className="w-16 text-center"
                  placeholder="-"
                />
                <span className="text-muted-foreground">:</span>
                <Input
                  type="number"
                  min={0}
                  value={bet.userBet.foreignGoals ?? ""}
                  onChange={(e) => setValue(bet.matchId, "foreignGoals", e.target.value)}
                  disabled={deadlinePassed}
                  className="w-16 text-center"
                  placeholder="-"
                />
                {hasResult && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({bet.realResult.homeGoals}:{bet.realResult.foreignGoals})
                  </span>
                )}
                {hasResult && resultBadge(bet)}
              </div>
            </div>
          );
        })}

        {!deadlinePassed && (
          <Button onClick={onSave} disabled={saving} className="mt-2 w-full sm:w-auto">
            <Save className="mr-2 size-4" />
            {saving ? "Saving..." : "Save Bets"}
          </Button>
        )}

        {message && (
          <Alert variant={message.includes("Failed") ? "destructive" : "default"}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
