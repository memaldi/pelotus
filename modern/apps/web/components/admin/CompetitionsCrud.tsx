"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Save, Swords, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Season = {
  id: number;
  leagueId: number;
  name: string;
  league: { id: number; name: string };
};

type Community = {
  id: number;
  name: string;
};

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
  const searchParams = useSearchParams();
  const requestedLeagueId = searchParams.get("leagueId");

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

    const competitionsPayload = (await competitionsRes.json()) as { competitions?: Competition[] };
    const seasonsPayload = (await seasonsRes.json()) as { seasons?: Season[] };
    const communitiesPayload = (await communitiesRes.json()) as { communities?: Community[] };

    setItems(competitionsPayload.competitions ?? []);
    setSeasons(seasonsPayload.seasons ?? []);
    setCommunities(communitiesPayload.communities ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  const visibleSeasons = requestedLeagueId
    ? seasons.filter((season) => season.leagueId === Number(requestedLeagueId))
    : seasons;

  const filteredSeasonIds = new Set(visibleSeasons.map((season) => season.id));
  const filteredItems = requestedLeagueId ? items.filter((item) => filteredSeasonIds.has(item.seasonId)) : items;

  useEffect(() => {
    if (!requestedLeagueId || seasonId !== "") {
      return;
    }

    const firstSeason = visibleSeasons[0];
    if (firstSeason) {
      setSeasonId(firstSeason.id);
    }
  }, [requestedLeagueId, visibleSeasons, seasonId]);

  async function createItem() {
    if (seasonId === "" || communityId === "") {
      setStatus("Season and community are required");
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
      setSeasonId(requestedLeagueId && visibleSeasons[0] ? visibleSeasons[0].id : "");
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

  const isError = status.toLowerCase().includes("failed") || status.toLowerCase().includes("required");

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="size-5 text-primary" />
            Competitions
          </CardTitle>
          <CardDescription>
            {requestedLeagueId
              ? "Managing competitions inside the selected league."
              : "Link each season to its competition community."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-12">
          <div className="space-y-2 md:col-span-5">
            <Label>Season</Label>
            <Select
              value={seasonId === "" ? undefined : String(seasonId)}
              onValueChange={(value) => setSeasonId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose season" />
              </SelectTrigger>
              <SelectContent>
                {visibleSeasons.map((season) => (
                  <SelectItem key={season.id} value={String(season.id)}>
                    {formatSeasonLabel(season)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-5">
            <Label>Community</Label>
            <Select
              value={communityId === "" ? undefined : String(communityId)}
              onValueChange={(value) => setCommunityId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose community" />
              </SelectTrigger>
              <SelectContent>
                {communities.map((community) => (
                  <SelectItem key={community.id} value={String(community.id)}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 md:self-end">
            <Button className="w-full" onClick={() => void createItem()}>
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="secondary">Competition #{item.id}</Badge>
                <span className="text-sm text-muted-foreground">
                  {item.community.name} · {formatSeasonLabel(item.season)}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="space-y-2 md:col-span-5">
                  <Label>Season</Label>
                  <Select
                    value={String(item.seasonId)}
                    onValueChange={(value) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, seasonId: Number(value) } : x,
                        ),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visibleSeasons.map((season) => (
                        <SelectItem key={season.id} value={String(season.id)}>
                          {formatSeasonLabel(season)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-4">
                  <Label>Community</Label>
                  <Select
                    value={String(item.communityId)}
                    onValueChange={(value) =>
                      setItems((prev) =>
                        prev.map((x) =>
                          x.id === item.id ? { ...x, communityId: Number(value) } : x,
                        ),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((community) => (
                        <SelectItem key={community.id} value={String(community.id)}>
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Trash2 className="mr-2 size-4" />
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
