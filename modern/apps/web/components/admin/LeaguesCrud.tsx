"use client";

import { useEffect, useState } from "react";

type League = {
  id: number;
  name: string;
  description: string;
};

export function LeaguesCrud() {
  const [items, setItems] = useState<League[]>([]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    const res = await fetch("/api/backend/api/admin/leagues", { cache: "no-store" });
    if (!res.ok) {
      setStatus("Failed to load leagues");
      return;
    }
    const payload = await res.json();
    setItems(payload.leagues ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createItem() {
    setStatus("Saving...");
    const res = await fetch("/api/backend/api/admin/leagues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      setName("");
      setDescription("");
      await load();
    }
  }

  async function updateItem(item: League) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/leagues/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: item.name, description: item.description }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      await load();
    }
  }

  async function deleteItem(id: number) {
    setStatus("Deleting...");
    const res = await fetch(`/api/backend/api/admin/leagues/${id}`, { method: "DELETE" });
    setStatus(res.ok ? "Deleted" : "Delete failed");
    if (res.ok) {
      await load();
    }
  }

  return (
    <section className="card">
      <h2>Leagues</h2>
      <div className="grid" style={{ marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <button onClick={() => void createItem()}>Create league</button>
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
            <input
              value={item.description}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((x) => (x.id === item.id ? { ...x, description: e.target.value } : x)),
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