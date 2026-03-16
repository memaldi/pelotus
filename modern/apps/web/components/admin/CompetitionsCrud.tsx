"use client";

import { useEffect, useState } from "react";

type Season = { id: number; name: string; league: { name: string } };
type Community = { id: number; name: string };
type Competition = {
  id: number;
  seasonId: number;
  communityId: number;
  season: { name: string; league: { name: string } };
  community: { name: string };
};

function formatSeasonLabel(season: Season | Competition["season"]) {
  return `${season.league.name} / ${season.name}`;
}

export function CompetitionsCrud() {
  const [items, setItems] = useState<Competition[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [status, setStatus] = useState("");
  const [seasonId, setSeasonId] = useState<number | "">("");
  const [communityId, setCommunityId] = useState<number | "">("");

  async function load() {
    const [competitionsRes, seasonsRes, communitiesRes] = await Promise.all([
      fetch("/api/backend/api/admin/competitions", { cache: "no-store" }),
      fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/communities", { cache: "no-store" }),
    ]);

    if (!competitionsRes.ok || !seasonsRes.ok || !communitiesRes.ok) {
      setStatus("Failed to load competitions context");
      return;
    }

    const competitionsPayload = await competitionsRes.json();
    const seasonsPayload = await seasonsRes.json();
    const communitiesPayload = await communitiesRes.json();

    setItems(competitionsPayload.competitions ?? []);
    setSeasons(seasonsPayload.seasons ?? []);
    setCommunities(communitiesPayload.communities ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createItem() {
    if (seasonId === "" || communityId === "") {
      return;
    }

    setStatus("Saving...");
    const res = await fetch("/api/backend/api/admin/competitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seasonId, communityId }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      setSeasonId("");
      setCommunityId("");
      await load();
    }
  }

  async function updateItem(item: Competition) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/competitions/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seasonId: item.seasonId, communityId: item.communityId }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      await load();
    }
  }

  async function deleteItem(id: number) {
    setStatus("Deleting...");
    const res = await fetch(`/api/backend/api/admin/competitions/${id}`, { method: "DELETE" });
    setStatus(res.ok ? "Deleted" : "Delete failed");
    if (res.ok) {
      await load();
    }
  }

  return (
    <section className="card">
      <h2>Competitions</h2>
      <div className="grid" style={{ marginBottom: 16 }}>
        <select value={seasonId} onChange={(e) => setSeasonId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>{formatSeasonLabel(s)}</option>
          ))}
        </select>
        <select value={communityId} onChange={(e) => setCommunityId(e.target.value === "" ? "" : Number(e.target.value))}>
          <option value="">Community</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={() => void createItem()}>Create competition</button>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {items.map((item) => (
          <article key={item.id} className="card">
            <p>Competition #{item.id}: {item.community.name} ({formatSeasonLabel(item.season)})</p>
            <select
              value={item.seasonId}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === item.id ? { ...x, seasonId: Number(e.target.value) } : x,
                  ),
                )
              }
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>{formatSeasonLabel(s)}</option>
              ))}
            </select>
            <select
              value={item.communityId}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((x) =>
                    x.id === item.id ? { ...x, communityId: Number(e.target.value) } : x,
                  ),
                )
              }
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
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
