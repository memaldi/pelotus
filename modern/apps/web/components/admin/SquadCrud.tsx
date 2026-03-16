"use client";

import { useEffect, useState } from "react";

type League = { id: number; name: string };
type Season = { id: number; name: string; league: League };
type Team = { id: number; name: string };
type Player = { id: number; name: string };
type PlayerEntry = { id: number; playerId: number; position: string; player: Player };
type TeamInSeason = {
  id: number;
  teamId: number;
  seasonId: number;
  spanishLeague: boolean;
  uefaLeague: boolean;
  championsLeague: boolean;
  kingsCup: boolean;
  team: Team;
  season: Season;
  players: PlayerEntry[];
};

const POSITIONS = ["GK", "DF", "MF", "FW"] as const;

function formatSeasonLabel(s: Season) {
  return `${s.league.name} / ${s.name}`;
}

export function SquadCrud() {
  const [teamInSeasons, setTeamInSeasons] = useState<TeamInSeason[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | "">("");
  const [enrollTeamId, setEnrollTeamId] = useState<number | "">("");
  const [status, setStatus] = useState("");
  const [addState, setAddState] = useState<Record<number, { playerIds: number[]; position: string }>>({});
  const [teamFlagsState, setTeamFlagsState] = useState<Record<number, {
    spanishLeague: boolean;
    uefaLeague: boolean;
    championsLeague: boolean;
    kingsCup: boolean;
  }>>({});
  const [playerPositionState, setPlayerPositionState] = useState<Record<number, string>>({});

  async function load() {
    const [tRes, pRes, sRes, teamsRes] = await Promise.all([
      fetch("/api/backend/api/admin/team-in-seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/players", { cache: "no-store" }),
      fetch("/api/backend/api/admin/seasons", { cache: "no-store" }),
      fetch("/api/backend/api/admin/teams", { cache: "no-store" }),
    ]);
    if (tRes.ok) {
      const d = await tRes.json() as { teamInSeasons: TeamInSeason[] };
      setTeamInSeasons(d.teamInSeasons ?? []);
    }
    if (pRes.ok) {
      const d = await pRes.json() as { players: Player[] };
      setAllPlayers(d.players ?? []);
    }
    if (sRes.ok) {
      const d = await sRes.json() as { seasons: Season[] };
      setSeasons((d.seasons ?? []).sort((a, b) => b.id - a.id));
    }
    if (teamsRes.ok) {
      const d = await teamsRes.json() as { teams: Team[] };
      setAllTeams(d.teams ?? []);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const visibleTeams = selectedSeasonId === ""
    ? []
    : teamInSeasons.filter((t) => t.seasonId === selectedSeasonId);

  const enrolledTeamIds = new Set(visibleTeams.map((t) => t.teamId));
  const availableToEnroll = allTeams.filter((t) => !enrolledTeamIds.has(t.id));

  async function enrollTeam() {
    if (selectedSeasonId === "" || enrollTeamId === "") return;
    setStatus("Enrolling...");
    const res = await fetch(`/api/backend/api/admin/seasons/${selectedSeasonId}/teams/${enrollTeamId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setStatus(res.ok ? "Team enrolled" : "Enroll failed");
    if (res.ok) {
      setEnrollTeamId("");
      await load();
    }
  }

  async function removeTeam(teamInSeasonId: number) {
    setStatus("Removing team...");
    const res = await fetch(`/api/backend/api/admin/team-in-seasons/${teamInSeasonId}`, { method: "DELETE" });
    setStatus(res.ok ? "Removed" : "Remove failed");
    if (res.ok) await load();
  }

  function getTeamFlags(tis: TeamInSeason) {
    return teamFlagsState[tis.id] ?? {
      spanishLeague: tis.spanishLeague,
      uefaLeague: tis.uefaLeague,
      championsLeague: tis.championsLeague,
      kingsCup: tis.kingsCup,
    };
  }

  function setTeamFlag(
    teamInSeasonId: number,
    key: "spanishLeague" | "uefaLeague" | "championsLeague" | "kingsCup",
    value: boolean,
  ) {
    setTeamFlagsState((prev) => ({
      ...prev,
      [teamInSeasonId]: {
        ...(prev[teamInSeasonId] ?? {
          spanishLeague: true,
          uefaLeague: false,
          championsLeague: false,
          kingsCup: false,
        }),
        [key]: value,
      },
    }));
  }

  async function saveTeamFlags(tis: TeamInSeason) {
    const flags = getTeamFlags(tis);
    setStatus("Saving team settings...");
    const res = await fetch(`/api/backend/api/admin/seasons/${tis.seasonId}/teams/${tis.teamId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flags),
    });
    setStatus(res.ok ? "Team settings saved" : "Save failed");
    if (res.ok) {
      setTeamFlagsState((prev) => {
        const next = { ...prev };
        delete next[tis.id];
        return next;
      });
      await load();
    }
  }

  function getAddForm(teamInSeasonId: number) {
    return addState[teamInSeasonId] ?? { playerIds: [], position: "GK" };
  }

  function setAddField(
    teamInSeasonId: number,
    field: "playerIds" | "position",
    value: number[] | string,
  ) {
    setAddState((prev) => ({
      ...prev,
      [teamInSeasonId]: { ...getAddForm(teamInSeasonId), [field]: value },
    }));
  }

  async function assign(tis: TeamInSeason) {
    const form = getAddForm(tis.id);
    if (form.playerIds.length === 0) return;
    setStatus("Saving...");
    const responses = await Promise.all(
      form.playerIds.map((playerId) =>
        fetch(`/api/backend/api/admin/team-in-seasons/${tis.id}/players`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, position: form.position }),
        }),
      ),
    );
    const ok = responses.every((res) => res.ok);
    setStatus(ok ? "Saved" : "Save failed");
    if (ok) {
      setAddState((prev) => ({ ...prev, [tis.id]: { playerIds: [], position: "GK" } }));
      await load();
    }
  }

  async function remove(teamInSeasonId: number, playerId: number) {
    setStatus("Removing...");
    const res = await fetch(
      `/api/backend/api/admin/team-in-seasons/${teamInSeasonId}/players/${playerId}`,
      { method: "DELETE" },
    );
    setStatus(res.ok ? "Removed" : "Remove failed");
    if (res.ok) await load();
  }

  function getPlayerPosition(entry: PlayerEntry) {
    return playerPositionState[entry.id] ?? entry.position;
  }

  async function savePlayerPosition(tis: TeamInSeason, entry: PlayerEntry) {
    const position = getPlayerPosition(entry);
    setStatus("Saving player position...");
    const res = await fetch(`/api/backend/api/admin/team-in-seasons/${tis.id}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: entry.playerId, position }),
    });
    setStatus(res.ok ? "Player updated" : "Save failed");
    if (res.ok) {
      setPlayerPositionState((prev) => {
        const next = { ...prev };
        delete next[entry.id];
        return next;
      });
      await load();
    }
  }

  return (
    <section className="card">
      <h2>Squad Assignment</h2>
      <p>Select a season to manage its enrolled teams and player assignments.</p>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <label className="form-label">Season</label>
          <select
            className="form-select"
            value={selectedSeasonId}
            onChange={(e) => { setSelectedSeasonId(e.target.value === "" ? "" : Number(e.target.value)); setEnrollTeamId(""); }}
          >
            <option value="">Pick a season</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>{formatSeasonLabel(s)}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedSeasonId !== "" && (
        <div className="row g-2 mb-3 align-items-end">
          <div className="col-12 col-lg-8">
            <label className="form-label">Add team to season</label>
            <select
              className="form-select"
              value={enrollTeamId}
              onChange={(e) => setEnrollTeamId(e.target.value === "" ? "" : Number(e.target.value))}
            >
              <option value="">Choose a team</option>
              {availableToEnroll.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-lg-4 d-grid">
            <button className="btn btn-warning" disabled={enrollTeamId === ""} onClick={() => void enrollTeam()}>
              Add team
            </button>
          </div>
        </div>
      )}

      <div className="row g-4">
        {visibleTeams.map((tis) => {
          const form = getAddForm(tis.id);
          const flags = getTeamFlags(tis);
          const assignedIds = new Set(tis.players.map((p) => p.playerId));
          const available = allPlayers.filter((p) => !assignedIds.has(p.id));

          return (
            <article key={tis.id} className="col-12">
              <div className="card">
                <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                  <h3 className="mb-0">{tis.team.name}</h3>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => void removeTeam(tis.id)}>Remove team</button>
                </div>

                <div className="row g-3 mt-3">
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={flags.spanishLeague}
                        onChange={(e) => setTeamFlag(tis.id, "spanishLeague", e.target.checked)}
                        id={`spanish-${tis.id}`}
                      />
                      <label className="form-check-label" htmlFor={`spanish-${tis.id}`}>
                        Spanish League
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={flags.uefaLeague}
                        onChange={(e) => setTeamFlag(tis.id, "uefaLeague", e.target.checked)}
                        id={`uefa-${tis.id}`}
                      />
                      <label className="form-check-label" htmlFor={`uefa-${tis.id}`}>
                        UEFA League
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={flags.championsLeague}
                        onChange={(e) => setTeamFlag(tis.id, "championsLeague", e.target.checked)}
                        id={`champions-${tis.id}`}
                      />
                      <label className="form-check-label" htmlFor={`champions-${tis.id}`}>
                        Champions League
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={flags.kingsCup}
                        onChange={(e) => setTeamFlag(tis.id, "kingsCup", e.target.checked)}
                        id={`kings-${tis.id}`}
                      />
                      <label className="form-check-label" htmlFor={`kings-${tis.id}`}>
                        Kings Cup
                      </label>
                    </div>
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <button className="btn btn-warning btn-sm" onClick={() => void saveTeamFlags(tis)}>Save team settings</button>
                  </div>
                </div>

                {tis.players.length > 0 ? (
                  <div className="table-responsive mt-3">
                    <table className="table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Player</th>
                          <th style={{ minWidth: 180 }}>Position</th>
                          <th style={{ minWidth: 180 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tis.players.map((pe) => (
                          <tr key={pe.id}>
                            <td>{pe.player.name}</td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={getPlayerPosition(pe)}
                                onChange={(e) =>
                                  setPlayerPositionState((prev) => ({ ...prev, [pe.id]: e.target.value }))
                                }
                              >
                                {POSITIONS.map((pos) => (
                                  <option key={pos} value={pos}>{pos}</option>
                                ))}
                              </select>
                            </td>
                            <td className="d-flex gap-2">
                              <button className="btn btn-warning btn-sm" onClick={() => void savePlayerPosition(tis, pe)}>Save</button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => void remove(tis.id, pe.playerId)}>Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="mt-3 mb-0">No players assigned yet.</p>
                )}

                {available.length > 0 && (
                  <div className="row g-2 mt-3">
                    <div className="col-12 col-lg-6">
                      <label className="form-label">Available players</label>
                      <select
                        className="form-select"
                        multiple
                        value={form.playerIds.map(String)}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
                          setAddField(tis.id, "playerIds", selected);
                        }}
                      >
                        {available.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <small>Select one or more players (Ctrl/Cmd click).</small>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3">
                      <label className="form-label">Position</label>
                      <select
                        className="form-select"
                        value={form.position}
                        onChange={(e) => setAddField(tis.id, "position", e.target.value)}
                      >
                        {POSITIONS.map((pos) => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-6 col-lg-3 d-grid align-self-end">
                      <button className="btn btn-warning" disabled={form.playerIds.length === 0} onClick={() => void assign(tis)}>
                        Assign selected
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {status ? <p className="mt-3 mb-0">{status}</p> : null}
    </section>
  );
}
