"use client";

import { useEffect, useState } from "react";

type Player = {
  id: number;
  name: string;
};

export function PlayersCrud() {
  const [items, setItems] = useState<Player[]>([]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");

  async function load() {
    const res = await fetch("/api/backend/api/admin/players", { cache: "no-store" });
    if (!res.ok) {
      setStatus("Failed to load players");
      return;
    }
    const payload = await res.json();
    setItems(payload.players ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createItem() {
    setStatus("Saving...");
    const res = await fetch("/api/backend/api/admin/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      setName("");
      await load();
    }
  }

  async function updateItem(item: Player) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/players/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: item.name }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      await load();
    }
  }

  async function deleteItem(id: number) {
    setStatus("Deleting...");
    const res = await fetch(`/api/backend/api/admin/players/${id}`, { method: "DELETE" });
    setStatus(res.ok ? "Deleted" : "Delete failed");
    if (res.ok) {
      await load();
    }
  }

  return (
    <section className="card">
      <h2>Players</h2>
      <div className="grid" style={{ marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <button onClick={() => void createItem()}>Create player</button>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        {items.map((item) => (
          <article key={item.id} className="card">
            <input
              value={item.name}
              onChange={(e) =>
                setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, name: e.target.value } : x)))
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