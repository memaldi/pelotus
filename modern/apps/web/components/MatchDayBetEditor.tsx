"use client";

import { useState } from "react";

type BetRow = {
  matchId: number;
  homeTeam: string;
  foreignTeam: string;
  userBet: {
    homeGoals: number | null;
    foreignGoals: number | null;
  };
  realResult: {
    homeGoals: number | null;
    foreignGoals: number | null;
  };
};

type MatchDayBetEditorProps = {
  competitionId: number;
  matchDayId: number;
  initialBets: BetRow[];
};

export function MatchDayBetEditor({
  competitionId,
  matchDayId,
  initialBets,
}: MatchDayBetEditorProps) {
  const [bets, setBets] = useState(initialBets);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function setValue(matchId: number, field: "homeGoals" | "foreignGoals", value: string) {
    const parsed = value.trim() === "" ? null : Number(value);
    setBets((prev: BetRow[]) =>
      prev.map((b: BetRow) =>
        b.matchId === matchId
          ? {
              ...b,
              userBet: {
                ...b.userBet,
                [field]: Number.isNaN(parsed) ? null : parsed,
              },
            }
          : b,
      ),
    );
  }

  async function onSave() {
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        bets: bets.map((b: BetRow) => ({
          matchId: b.matchId,
          homeGoals: b.userBet.homeGoals,
          foreignGoals: b.userBet.foreignGoals,
        })),
      };

      const res = await fetch(
        `/api/backend/api/competitions/${competitionId}/match-days/${matchDayId}/bets`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        throw new Error(`Save failed with status ${res.status}`);
      }

      setMessage("Saved");
    } catch {
      setMessage("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2>Edit Match-Day Bets</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {bets.map((bet: BetRow) => (
          <div key={bet.matchId} style={{ borderBottom: "1px solid #e5ddcc", paddingBottom: 10 }}>
            <strong>
              {bet.homeTeam} vs {bet.foreignTeam}
            </strong>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                type="number"
                value={bet.userBet.homeGoals ?? ""}
                onChange={(e) => setValue(bet.matchId, "homeGoals", e.target.value)}
                style={{ width: 70 }}
              />
              <input
                type="number"
                value={bet.userBet.foreignGoals ?? ""}
                onChange={(e) => setValue(bet.matchId, "foreignGoals", e.target.value)}
                style={{ width: 70 }}
              />
              <span style={{ color: "#666" }}>
                Result: {bet.realResult.homeGoals ?? "-"} - {bet.realResult.foreignGoals ?? "-"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSave} disabled={saving} style={{ marginTop: 14 }}>
        {saving ? "Saving..." : "Save Bets"}
      </button>
      {message ? <p style={{ marginTop: 8 }}>{message}</p> : null}
    </div>
  );
}
