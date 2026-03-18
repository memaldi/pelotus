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

type Community = {
  id: number;
  name: string;
  description: string;
};

export function CommunitiesCrud() {
  const [items, setItems] = useState<Community[]>([]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function load() {
    const res = await fetch("/api/backend/api/admin/communities", { cache: "no-store" });
    if (!res.ok) {
      setStatus("Failed to load communities");
      return;
    }
    const payload = (await res.json()) as { communities?: Community[] };
    setItems(payload.communities ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createItem() {
    setStatus("Saving...");
    const res = await fetch("/api/backend/api/admin/communities", {
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

  async function updateItem(item: Community) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/communities/${item.id}`, {
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
    const res = await fetch(`/api/backend/api/admin/communities/${id}`, { method: "DELETE" });
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
          <CardTitle>Communities</CardTitle>
          <CardDescription>
            Manage community records used by competition assignments.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-12">
          <div className="space-y-2 md:col-span-4">
            <Label htmlFor="community-name">Name</Label>
            <Input
              id="community-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="La Liga Fans"
            />
          </div>
          <div className="space-y-2 md:col-span-6">
            <Label htmlFor="community-description">Description</Label>
            <Input
              id="community-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Official supporters community"
            />
          </div>
          <div className="md:col-span-2 md:self-end">
            <Button className="w-full" onClick={() => void createItem()}>
              <Plus className="mr-2 size-4" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-4 pt-6">
              <Badge variant="secondary">Community #{item.id}</Badge>
              <div className="grid gap-4 md:grid-cols-12">
                <div className="space-y-2 md:col-span-4">
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
                <div className="space-y-2 md:col-span-5">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, description: event.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-2 md:col-span-3 md:self-end">
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
