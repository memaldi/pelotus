"use client";

import { useEffect, useState } from "react";

type League = {
  id: number;
  name: string;
};

type Season = {
  id: number;
  leagueId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  league: League;
};

export function SeasonsCrud() {
  const [items, setItems] = useState<Season[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [status, setStatus] = useState("");
  const [leagueId, setLeagueId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function formatSeasonLabel(season: Season) {
    return `${season.league.name} / ${season.name}`;
  }

  async function load() {
    const [seasonsRes, leaguesRes] = await Promise.all([
      fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/leagues", { cache: "no-store" }),
    ]);

    if (!seasonsRes.ok || !leaguesRes.ok) {
      setStatus("Failed to load seasons");
      return;
    }

    const seasonsPayload = await seasonsRes.json();
    const leaguesPayload = await leaguesRes.json();
    setItems(seasonsPayload.seasons ?? []);
    setLeagues(leaguesPayload.leagues ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createItem() {
    if (leagueId === "") {
      return;
    }

    setStatus("Saving...");
    const res = await fetch("/api/backend/api/admin/seasons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leagueId,
        name,
        description,
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: `${endDate}T23:59:59.999Z`,
      }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      setLeagueId("");
      setName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      await load();
    }
  }

  async function updateItem(item: Season) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/seasons/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leagueId: item.leagueId,
        name: item.name,
        description: item.description,
        startDate: item.startDate,
        endDate: item.endDate,
      }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      await load();
    }
  }

  async function deleteItem(id: number) {
    setStatus("Deleting...");
    const res = await fetch(`/api/backend/api/admin/seasons/${id}`, { method: "DELETE" });
    setStatus(res.ok ? "Deleted" : "Delete failed");
    if (res.ok) {
      await load();
    }
  }

  return (
    <section className="card">
      <h2>Seasons</h2>
      <div className="grid" style={{ marginBottom: 16 }}>
        <select value={leagueId} onChange={(e) => setLeagueId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">League</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>{league.name}</option>
          ))}
        </select>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" />
        <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />
        <button onClick={() => void createItem()}>Create season</button>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {items.map((item) => (
          <article key={item.id} className="card">
            <p>{formatSeasonLabel(item)}</p>
            <select
              value={item.leagueId}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === item.id
                      ? {
                          ...x,
                          leagueId: Number(e.target.value),
                          league: leagues.find((league) => league.id === Number(e.target.value)) ?? x.league,
                        }
                      : x,
                  ),
                )
              }
            >
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>{league.name}</option>
              ))}
            </select>
            <input
              value={item.name}
              onChange={(e) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, name: e.target.value } : x)))
              }
            />
            <input
              value={item.description}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, description: e.target.value } : x)),
                )
              }
            />
            <input
              type="datetime-local"
              value={new Date(item.startDate).toISOString().slice(0, 16)}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === item.id ? { ...x, startDate: new Date(e.target.value).toISOString() } : x,
                  ),
                )
              }
            />
            <input
              type="datetime-local"
              value={new Date(item.endDate).toISOString().slice(0, 16)}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === item.id ? { ...x, endDate: new Date(e.target.value).toISOString() } : x,
                  ),
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
