"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Community = {
  id: number;
  name: string;
  description: string;
};

export function CommunityOnboarding() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  function onInputChange(setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value);
    };
  }

  useEffect(() => {
    async function load() {
      const suffix = query ? `?query=${encodeURIComponent(query)}` : "";
      const res = await fetch(`/api/backend/api/communities${suffix}`);
      if (!res.ok) {
        return;
      }
      const payload = await res.json();
      setCommunities(payload.communities ?? []);
    }

    void load();
  }, [query]);

  async function createCommunity() {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/communities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      setStatus("Create failed");
      return;
    }

    const payload = await res.json();
    router.push(`/competitions/${payload.competition.id}/dashboard`);
    router.refresh();
  }

  async function joinCommunity(communityId: number) {
    setStatus("Joining...");
    const res = await fetch(`/api/backend/api/communities/${communityId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      setStatus("Join failed");
      return;
    }

    const payload = await res.json();
    router.push(`/competitions/${payload.competition.id}/dashboard`);
    router.refresh();
  }

  return (
    <main>
      <section className="grid cols-2">
        <article className="card">
          <span className="kicker">Create Community</span>
          <h1>Create a new community</h1>
          <div className="grid" style={{ gap: 12 }}>
            <input value={name} onChange={onInputChange(setName)} placeholder="Community name" />
            <textarea value={description} onChange={onInputChange(setDescription)} placeholder="Description" rows={4} />
          </div>
          <button onClick={createCommunity} style={{ marginTop: 12 }}>Create</button>
        </article>

        <article className="card">
          <span className="kicker">Join Community</span>
          <h1>Join an existing community</h1>
          <input value={query} onChange={onInputChange(setQuery)} placeholder="Search communities" />
          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            {communities.map((community) => (
              <div key={community.id} style={{ borderBottom: "1px solid #e5ddcc", paddingBottom: 10 }}>
                <strong>{community.name}</strong>
                <p>{community.description}</p>
                <button onClick={() => joinCommunity(community.id)}>Join</button>
              </div>
            ))}
          </div>
        </article>
      </section>
      {status ? <p style={{ marginTop: 16 }}>{status}</p> : null}
    </main>
  );
}
