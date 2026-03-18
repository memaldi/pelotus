"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, ExternalLink } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

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
      setStatus("Failed to load leagues.");
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
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            Leagues
          </CardTitle>
          <CardDescription>
            Create and maintain league containers before configuring seasons and squads.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="league-name">League name</Label>
            <Input
              id="league-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="League name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="league-description">Description</Label>
            <Textarea
              id="league-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe league scope, competition format, or rules"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => void createItem()}>Create league</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">League #{item.id}</CardTitle>
                <Badge variant="secondary">Editable</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={item.name}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((x) => (x.id === item.id ? { ...x, name: e.target.value } : x)),
                    )
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((x) =>
                        x.id === item.id ? { ...x, description: e.target.value } : x,
                      ),
                    )
                  }
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary">
                  <Link href={`/admin/leagues/${item.id}`}>
                    <ExternalLink className="mr-2 size-4" />
                    Workspace
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/admin/seasons?leagueId=${item.id}`}>Seasons</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/admin/squad?leagueId=${item.id}`}>Squad</Link>
                </Button>
                <Button variant="outline" onClick={() => void updateItem(item)}>
                  Save
                </Button>
                <Button variant="destructive" onClick={() => void deleteItem(item.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {status ? (
        <Alert variant={status.includes("failed") ? "destructive" : "default"}>
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      ) : null}
    </section>
  );
}
