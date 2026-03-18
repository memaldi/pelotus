"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    const payload = (await res.json()) as { players?: Player[] };
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

  const isError = status.toLowerCase().includes("failed");

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
          <CardDescription>Manage player identities for squad assignments.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-12">
          <div className="space-y-2 md:col-span-9">
            <Label htmlFor="player-name">Player name</Label>
            <Input
              id="player-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Moreno"
            />
          </div>
          <div className="md:col-span-3 md:self-end">
            <Button className="w-full" onClick={() => void createItem()}>
              <Plus className="mr-2 size-4" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-4 pt-6">
              <Badge variant="secondary">Player #{item.id}</Badge>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={item.name}
                  onChange={(event) =>
                    setItems((prev) =>
                      prev.map((x) => (x.id === item.id ? { ...x, name: event.target.value } : x)),
                    )
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => void updateItem(item)}>
                  <Save className="mr-2 size-4" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => void deleteItem(item.id)}
                >
                  <Trash className="mr-2 size-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {status ? (
        <Alert variant={isError ? "destructive" : "default"}>
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      ) : null}
    </section>
  );
}
