"use client";

import { useEffect, useState } from "react";

type Season = { id: number; name: string; league: { name: string } };
type MatchDay = {
  id: number;
  seasonId: number;
  number: number;
  startDate: string;
  season: { name: string; league: { name: string } };
};

function formatSeasonLabel(season: Season | MatchDay["season"]) {
  return `${season.league.name} / ${season.name}`;
}

export function MatchDaysCrud() {
  const [items, setItems] = useState<MatchDay[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [status, setStatus] = useState("");
  const [seasonId, setSeasonId] = useState<number | "">("");
  const [number, setNumber] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");

  async function load() {
    const [matchDaysRes, seasonsRes] = await Promise.all([
      fetch("/api/backend/api/admin/match-days", { cache: "no-store" }),
      fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
    ]);

    if (!matchDaysRes.ok || !seasonsRes.ok) {
      setStatus("Failed to load match days context");
      return;
    }

    const matchDaysPayload = await matchDaysRes.json();
    const seasonsPayload = await seasonsRes.json();
    setItems(matchDaysPayload.matchDays ?? []);
    setSeasons(seasonsPayload.seasons ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createItem() {
    if (seasonId === "" || number === "" || !startDate) {
      return;
    }

    setStatus("Saving...");
    const res = await fetch("/api/backend/api/admin/match-days", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seasonId,
        number,
        startDate: new Date(startDate).toISOString(),
      }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      setSeasonId("");
      setNumber("");
      setStartDate("");
      await load();
    }
  }

  async function updateItem(item: MatchDay) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/match-days/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seasonId: item.seasonId,
        number: item.number,
        startDate: item.startDate,
      }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      await load();
    }
  }

  async function deleteItem(id: number) {
    setStatus("Deleting...");
    const res = await fetch(`/api/backend/api/admin/match-days/${id}`, { method: "DELETE" });
    setStatus(res.ok ? "Deleted" : "Delete failed");
    if (res.ok) {
      await load();
    }
  }

  return (
    <section className="card">
      <h2>Match Days</h2>
      <div className="grid" style={{ marginBottom: 16 }}>
        <select value={seasonId} onChange={(e) => setSeasonId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>{formatSeasonLabel(s)}</option>
          ))}
        </select>
        <input value={number} onChange={(e) => setNumber(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Number" />
        <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="datetime-local" />
        <button onClick={() => void createItem()}>Create match day</button>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {items.map((item) => (
          <article key={item.id} className="card">
            <p>Match day {item.number} ({formatSeasonLabel(item.season)})</p>
            <select
              value={item.seasonId}
              onChange={(e) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, seasonId: Number(e.target.value) } : x)))
              }
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>{formatSeasonLabel(s)}</option>
              ))}
            </select>
            <input
              value={item.number}
              onChange={(e) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, number: Number(e.target.value) } : x)))
              }
              type="number"
            />
            <input
              type="datetime-local"
              value={new Date(item.startDate).toISOString().slice(0, 16)}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, startDate: new Date(e.target.value).toISOString() } : x)),
                )
              }
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