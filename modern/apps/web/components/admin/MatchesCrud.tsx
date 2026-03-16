"use client";

import { useEffect, useState } from "react";

type Team = { id: number; name: string };
type MatchDay = { id: number; number: number; season: { name: string; league: { name: string } } };
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

    const matchesPayload = await matchesRes.json();
    const teamsPayload = await teamsRes.json();
    const matchDaysPayload = await matchDaysRes.json();
    setItems(matchesPayload.matches ?? []);
    setTeams(teamsPayload.teams ?? []);
    setMatchDays(matchDaysPayload.matchDays ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createItem() {
    if (matchDayId === "" || homeTeamId === "" || foreignTeamId === "") {
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
      setMatchDayId("");
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

  return (
    <section className="card">
      <h2>Matches</h2>
      <div className="grid" style={{ marginBottom: 16 }}>
        <select value={matchDayId} onChange={(e) => setMatchDayId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">Match day</option>
          {matchDays.map((md) => (
            <option key={md.id} value={md.id}>{formatMatchDayLabel(md)}</option>
          ))}
        </select>
        <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">Home team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select value={foreignTeamId} onChange={(e) => setForeignTeamId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">Away team</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <input value={homeGoals} onChange={(e) => setHomeGoals(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Home goals" />
        <input value={foreignGoals} onChange={(e) => setForeignGoals(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Away goals" />
        <button onClick={() => void createItem()}>Create match</button>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {items.map((item) => (
          <article key={item.id} className="card">
            <select
              value={item.matchDayId}
              onChange={(e) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, matchDayId: Number(e.target.value) } : x)))
              }
            >
              {matchDays.map((md) => (
                <option key={md.id} value={md.id}>{formatMatchDayLabel(md)}</option>
              ))}
            </select>
            <select
              value={item.homeTeamId}
              onChange={(e) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, homeTeamId: Number(e.target.value) } : x)))
              }
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <select
              value={item.foreignTeamId}
              onChange={(e) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, foreignTeamId: Number(e.target.value) } : x)))
              }
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <input
              value={item.homeGoals ?? ""}
              onChange={(e) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, homeGoals: e.target.value === "" ? null : Number(e.target.value) } : x)))
              }
              type="number"
            />
            <input
              value={item.foreignGoals ?? ""}
              onChange={(e) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, foreignGoals: e.target.value === "" ? null : Number(e.target.value) } : x)))
              }
              type="number"
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => void updateItem(item)}>Save</button>
              <button onClick={() => void deleteItem(item.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
      {status ? <p>{status}</p> : null}
    </section>
  );
}