"use client";

import { useState } from "react";

type Team = { id: number; name: string };
type Player = { id: number; name: string };

type Props = {
  competitionId: number;
  teams: {
    spanishLeague: Team[];
    kingsCup: Team[];
    uefa: Team[];
    champions: Team[];
  };
  goalkeepers: Player[];
  initial: any;
};

export function GlobalBetEditor({ competitionId, teams, goalkeepers, initial }: Props) {
  const [status, setStatus] = useState("");
  const [winterChampionId, setWinterChampionId] = useState<number | "">(initial?.winterChampionId ?? "");
  const [leagueChampionId, setLeagueChampionId] = useState<number | "">(initial?.leagueChampionId ?? "");
  const [kingsCupChampionId, setKingsCupChampionId] = useState<number | "">(initial?.kingsCupChampionId ?? "");
  const [uefaChampionId, setUefaChampionId] = useState<number | "">(initial?.uefaChampionId ?? "");
  const [championsLeagueChampionId, setChampionsLeagueChampionId] = useState<number | "">(initial?.championsLeagueChampionId ?? "");
  const [bestGoalkeeperId, setBestGoalkeeperId] = useState<number | "">(initial?.bestGoalkeeperId ?? "");

  async function save() {
    setStatus("Saving...");
    const payload = {
      winterChampionId: winterChampionId === "" ? null : winterChampionId,
      kingsCupChampionId: kingsCupChampionId === "" ? null : kingsCupChampionId,
      leagueChampionId: leagueChampionId === "" ? null : leagueChampionId,
      uefaChampionId: uefaChampionId === "" ? null : uefaChampionId,
      championsLeagueChampionId:
        championsLeagueChampionId === "" ? null : championsLeagueChampionId,
      bestGoalkeeperId: bestGoalkeeperId === "" ? null : bestGoalkeeperId,
      championsPositionIds: initial?.championsPositions?.map((x: Team) => x.id) ?? [],
      uefaPositionIds: initial?.uefaPositions?.map((x: Team) => x.id) ?? [],
      demotionPositionIds: initial?.demotionPositions?.map((x: Team) => x.id) ?? [],
    };

    const res = await fetch(`/api/backend/api/competitions/${competitionId}/global-bets`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setStatus(res.ok ? "Saved" : "Save failed");
  }

  function selectOptions(list: Team[]) {
    return (
      <>
        <option value="">-</option>
        {list.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </>
    );
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h2>Edit Global Bet</h2>
      <div className="grid cols-2">
        <label>
          Winter champion
          <select value={winterChampionId} onChange={(e) => setWinterChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            {selectOptions(teams.spanishLeague)}
          </select>
        </label>

        <label>
          League champion
          <select value={leagueChampionId} onChange={(e) => setLeagueChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            {selectOptions(teams.spanishLeague)}
          </select>
        </label>

        <label>
          Kings cup champion
          <select value={kingsCupChampionId} onChange={(e) => setKingsCupChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            {selectOptions(teams.kingsCup)}
          </select>
        </label>

        <label>
          UEFA champion
          <select value={uefaChampionId} onChange={(e) => setUefaChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            {selectOptions(teams.uefa)}
          </select>
        </label>

        <label>
          Champions champion
          <select value={championsLeagueChampionId} onChange={(e) => setChampionsLeagueChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            {selectOptions(teams.champions)}
          </select>
        </label>

        <label>
          Best goalkeeper
          <select value={bestGoalkeeperId} onChange={(e) => setBestGoalkeeperId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">-</option>
            {goalkeepers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={save} style={{ marginTop: 12 }}>Save global bet</button>
      {status ? <p>{status}</p> : null}
    </div>
  );
}
