"use client";

import { useState } from "react";

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
};

export function ScorersEditor({
  competitionId,
  matchDayId,
  candidates,
  initial,
}: Props) {
  const [defenseId, setDefenseId] = useState<number | "">(initial?.defenseId ?? "");
  const [midfieldId, setMidfieldId] = useState<number | "">(initial?.midfieldId ?? "");
  const [forwardId, setForwardId] = useState<number | "">(initial?.forwardId ?? "");
  const [status, setStatus] = useState<string>("");

  async function save() {
    setStatus("Saving...");
    const payload = {
      defenseId: defenseId === "" ? null : defenseId,
      midfieldId: midfieldId === "" ? null : midfieldId,
      forwardId: forwardId === "" ? null : forwardId,
    };

    const res = await fetch(
      `/api/backend/api/competitions/${competitionId}/match-days/${matchDayId}/scorers`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setStatus(res.ok ? "Saved" : "Save failed");
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h2>Edit Scorers</h2>

      <label>
        Defense
        <select value={defenseId} onChange={(e) => setDefenseId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">-</option>
          {candidates.defenders.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label style={{ marginLeft: 12 }}>
        Midfield
        <select value={midfieldId} onChange={(e) => setMidfieldId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">-</option>
          {candidates.midfielders.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label style={{ marginLeft: 12 }}>
        Forward
        <select value={forwardId} onChange={(e) => setForwardId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">-</option>
          {candidates.forwards.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <div>
        <button onClick={save} style={{ marginTop: 12 }}>Save scorers</button>
        {status ? <p>{status}</p> : null}
      </div>
    </div>
  );
}
