"use client";

import { useEffect, useMemo, useState } from "react";

type League = { id: number; name: string };
type Season = { id: number; name: string; league: League };
type Team = { id: number; name: string };
type Player = { id: number; name: string };

type TeamInSeason = {
  id: number;
  seasonId: number;
  teamId: number;
  team: Team;
  players: Array<{ id: number; position: string; playerId: number; player: Player }>;
};

type GlobalResults = {
  id: number;
  seasonId: number;
  deadline: string;
  winterChampionId: number | null;
  kingsCupChampionId: number | null;
  leagueChampionId: number | null;
  uefaChampionId: number | null;
  championsLeagueChampionId: number | null;
  bestGoalkeeperId: number | null;
  championsPositions: Team[];
  uefaPositions: Team[];
  demotionPositions: Team[];
};

type FormState = {
  deadline: string;
  winterChampionId: number | "";
  kingsCupChampionId: number | "";
  leagueChampionId: number | "";
  uefaChampionId: number | "";
  championsLeagueChampionId: number | "";
  bestGoalkeeperId: number | "";
  championsPositionIds: number[];
  uefaPositionIds: number[];
  demotionPositionIds: number[];
};

function formatSeasonLabel(s: Season) {
  return `${s.league.name} / ${s.name}`;
}

function emptyForm(): FormState {
  return {
    deadline: "",
    winterChampionId: "",
    kingsCupChampionId: "",
    leagueChampionId: "",
    uefaChampionId: "",
    championsLeagueChampionId: "",
    bestGoalkeeperId: "",
    championsPositionIds: [],
    uefaPositionIds: [],
    demotionPositionIds: [],
  };
}

export function GlobalBetsCrud() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teamInSeasons, setTeamInSeasons] = useState<TeamInSeason[]>([]);
  const [globalResults, setGlobalResults] = useState<GlobalResults[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | "">("");
  const [form, setForm] = useState<FormState>(emptyForm());
  const [status, setStatus] = useState("");

  async function load() {
    const [sRes, tisRes, grRes] = await Promise.all([
      fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/team-in-seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/global-results", { cache: "no-store" }),
    ]);

    if (sRes.ok) {
      const d = (await sRes.json()) as { seasons: Season[] };
      setSeasons(d.seasons ?? []);
    }
    if (tisRes.ok) {
      const d = (await tisRes.json()) as { teamInSeasons: TeamInSeason[] };
      setTeamInSeasons(d.teamInSeasons ?? []);
    }
    if (grRes.ok) {
      const d = (await grRes.json()) as { globalResults: GlobalResults[] };
      setGlobalResults(d.globalResults ?? []);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const seasonTeams = useMemo(() => {
    if (selectedSeasonId === "") return [] as Team[];
    const map = new Map<number, Team>();
    for (const row of teamInSeasons) {
      if (row.seasonId === selectedSeasonId) map.set(row.team.id, row.team);
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [teamInSeasons, selectedSeasonId]);

  const goalkeepers = useMemo(() => {
    if (selectedSeasonId === "") return [] as Player[];
    const map = new Map<number, Player>();
    for (const row of teamInSeasons) {
      if (row.seasonId !== selectedSeasonId) continue;
      for (const entry of row.players) {
        if (entry.position === "GK") map.set(entry.player.id, entry.player);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [teamInSeasons, selectedSeasonId]);

  function loadSeasonForm(seasonId: number) {
    const current = globalResults.find((x) => x.seasonId === seasonId);
    if (!current) {
      setForm(emptyForm());
      return;
    }

    setForm({
      deadline: new Date(current.deadline).toISOString().slice(0, 16),
      winterChampionId: current.winterChampionId ?? "",
      kingsCupChampionId: current.kingsCupChampionId ?? "",
      leagueChampionId: current.leagueChampionId ?? "",
      uefaChampionId: current.uefaChampionId ?? "",
      championsLeagueChampionId: current.championsLeagueChampionId ?? "",
      bestGoalkeeperId: current.bestGoalkeeperId ?? "",
      championsPositionIds: current.championsPositions.map((x) => x.id),
      uefaPositionIds: current.uefaPositions.map((x) => x.id),
      demotionPositionIds: current.demotionPositions.map((x) => x.id),
    });
  }

  async function save() {
    if (selectedSeasonId === "" || !form.deadline) {
      setStatus("Season and deadline are required");
      return;
    }

    setStatus("Saving...");
    const res = await fetch(`/api/backend/api/admin/seasons/${selectedSeasonId}/global-results`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deadline: new Date(form.deadline).toISOString(),
        winterChampionId: form.winterChampionId === "" ? null : form.winterChampionId,
        kingsCupChampionId: form.kingsCupChampionId === "" ? null : form.kingsCupChampionId,
        leagueChampionId: form.leagueChampionId === "" ? null : form.leagueChampionId,
        uefaChampionId: form.uefaChampionId === "" ? null : form.uefaChampionId,
        championsLeagueChampionId: form.championsLeagueChampionId === "" ? null : form.championsLeagueChampionId,
        bestGoalkeeperId: form.bestGoalkeeperId === "" ? null : form.bestGoalkeeperId,
        championsPositionIds: form.championsPositionIds,
        uefaPositionIds: form.uefaPositionIds,
        demotionPositionIds: form.demotionPositionIds,
      }),
    });

    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) {
      await load();
    }
  }

  function updateMulti(
    key: "championsPositionIds" | "uefaPositionIds" | "demotionPositionIds",
    selectedOptions: HTMLCollectionOf<HTMLOptionElement>,
  ) {
    const ids = Array.from(selectedOptions).map((x) => Number(x.value));
    setForm((prev) => ({ ...prev, [key]: ids }));
  }

  return (
    <section className="card">
      <h2>Global Bets Management</h2>
      <p>Configure season global bet outcomes and positions.</p>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <label className="form-label">Season</label>
          <select
            className="form-select"
          value={selectedSeasonId}
          onChange={(e) => {
            const id = e.target.value === "" ? "" : Number(e.target.value);
            setSelectedSeasonId(id);
            if (id === "") {
              setForm(emptyForm());
            } else {
              loadSeasonForm(id);
            }
          }}
        >
          <option value="">Season</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>{formatSeasonLabel(s)}</option>
          ))}
          </select>
        </div>

        <div className="col-12 col-lg-6">
          <label className="form-label">Deadline</label>
          <input
            className="form-control"
            type="datetime-local"
            value={form.deadline}
            onChange={(e) => setForm((prev) => ({ ...prev, deadline: e.target.value }))}
          />
        </div>
      </div>

      {selectedSeasonId !== "" ? (
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <label className="form-label">Winter champion</label>
            <select
            className="form-select"
            value={form.winterChampionId}
            onChange={(e) => setForm((prev) => ({ ...prev, winterChampionId: e.target.value === "" ? "" : Number(e.target.value) }))}
          >
            <option value="">Winter champion</option>
            {seasonTeams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Kings Cup champion</label>
            <select
            className="form-select"
            value={form.kingsCupChampionId}
            onChange={(e) => setForm((prev) => ({ ...prev, kingsCupChampionId: e.target.value === "" ? "" : Number(e.target.value) }))}
          >
            <option value="">Kings Cup champion</option>
            {seasonTeams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">League champion</label>
            <select
            className="form-select"
            value={form.leagueChampionId}
            onChange={(e) => setForm((prev) => ({ ...prev, leagueChampionId: e.target.value === "" ? "" : Number(e.target.value) }))}
          >
            <option value="">League champion</option>
            {seasonTeams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">UEFA champion</label>
            <select
            className="form-select"
            value={form.uefaChampionId}
            onChange={(e) => setForm((prev) => ({ ...prev, uefaChampionId: e.target.value === "" ? "" : Number(e.target.value) }))}
          >
            <option value="">UEFA champion</option>
            {seasonTeams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Champions League champion</label>
            <select
            className="form-select"
            value={form.championsLeagueChampionId}
            onChange={(e) => setForm((prev) => ({ ...prev, championsLeagueChampionId: e.target.value === "" ? "" : Number(e.target.value) }))}
          >
            <option value="">Champions League champion</option>
            {seasonTeams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">Best goalkeeper</label>
            <select
            className="form-select"
            value={form.bestGoalkeeperId}
            onChange={(e) => setForm((prev) => ({ ...prev, bestGoalkeeperId: e.target.value === "" ? "" : Number(e.target.value) }))}
          >
            <option value="">Best goalkeeper</option>
            {goalkeepers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            </select>
          </div>

          <div className="col-12 col-lg-4">
            <label className="form-label">Champions positions</label>
            <select
              className="form-select"
              multiple
              value={form.championsPositionIds.map(String)}
              onChange={(e) => updateMulti("championsPositionIds", e.target.selectedOptions)}
            >
              {seasonTeams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-lg-4">
            <label className="form-label">UEFA positions</label>
            <select
              className="form-select"
              multiple
              value={form.uefaPositionIds.map(String)}
              onChange={(e) => updateMulti("uefaPositionIds", e.target.selectedOptions)}
            >
              {seasonTeams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-lg-4">
            <label className="form-label">Demotion positions</label>
            <select
              className="form-select"
              multiple
              value={form.demotionPositionIds.map(String)}
              onChange={(e) => updateMulti("demotionPositionIds", e.target.selectedOptions)}
            >
              {seasonTeams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-warning" onClick={() => void save()}>Save global bets/results</button>
          </div>
        </div>
      ) : null}

      {status ? <p>{status}</p> : null}
    </section>
  );
}
