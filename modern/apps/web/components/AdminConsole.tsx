"use client";

import { useEffect, useState } from "react";

type BootstrapData = {
  leagues: Array<{ id: number; name: string; description: string }>;
  seasons: Array<{ id: number; leagueId: number; name: string; league: { name: string } }>;
  communities: Array<{ id: number; name: string }>;
  competitions: Array<{ id: number; season: { name: string; league: { name: string } }; community: { name: string } }>;
  teams: Array<{ id: number; name: string }>;
  players: Array<{ id: number; name: string }>;
  teamInSeasons: Array<{ id: number; seasonId: number; season: { name: string; league: { name: string } }; team: { name: string } }>;
  matchDays: Array<{ id: number; number: number; seasonId: number; season: { name: string; league: { name: string } } }>;
  matches: Array<{
    id: number;
    matchDayId: number;
    matchDay: { number: number };
    homeTeam: { name: string };
    foreignTeam: { name: string };
  }>;
};

export function AdminConsole() {
  const [data, setData] = useState<BootstrapData | null>(null);
  const [status, setStatus] = useState("");

  const [leagueName, setLeagueName] = useState("");
  const [leagueDescription, setLeagueDescription] = useState("");
  const [seasonLeagueId, setSeasonLeagueId] = useState<number | "">("");
  const [seasonName, setSeasonName] = useState("");
  const [seasonDescription, setSeasonDescription] = useState("");
  const [seasonStartDate, setSeasonStartDate] = useState("");
  const [seasonEndDate, setSeasonEndDate] = useState("");

  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");

  const [competitionSeasonId, setCompetitionSeasonId] = useState<number | "">("");
  const [competitionCommunityId, setCompetitionCommunityId] = useState<number | "">("");

  const [teamName, setTeamName] = useState("");
  const [playerName, setPlayerName] = useState("");

  const [matchDayCompetitionId, setMatchDayCompetitionId] = useState<number | "">("");
  const [matchDayNumber, setMatchDayNumber] = useState<number | "">("");
  const [matchDayStartDate, setMatchDayStartDate] = useState("");

  const [teamInSeasonSeasonId, setTeamInSeasonSeasonId] = useState<number | "">("");
  const [teamInSeasonTeamId, setTeamInSeasonTeamId] = useState<number | "">("");
  const [spanishLeague, setSpanishLeague] = useState(true);
  const [uefaLeague, setUefaLeague] = useState(false);
  const [championsLeague, setChampionsLeague] = useState(false);
  const [kingsCup, setKingsCup] = useState(false);

  const [matchDayId, setMatchDayId] = useState<number | "">("");
  const [homeTeamId, setHomeTeamId] = useState<number | "">("");
  const [awayTeamId, setAwayTeamId] = useState<number | "">("");

  const [playerTeamInSeasonId, setPlayerTeamInSeasonId] = useState<number | "">("");
  const [playerId, setPlayerId] = useState<number | "">("");
  const [playerPosition, setPlayerPosition] = useState<"GK" | "DF" | "MF" | "FW">("GK");

  const [resultMatchId, setResultMatchId] = useState<number | "">("");
  const [resultHomeGoals, setResultHomeGoals] = useState<number | "">("");
  const [resultAwayGoals, setResultAwayGoals] = useState<number | "">("");

  const [goalsMatchDayId, setGoalsMatchDayId] = useState<number | "">("");
  const [goalsPlayerId, setGoalsPlayerId] = useState<number | "">("");
  const [goalsValue, setGoalsValue] = useState<number | "">("");

  const [globalResultsSeasonId, setGlobalResultsSeasonId] = useState<number | "">("");
  const [globalResultsDeadline, setGlobalResultsDeadline] = useState("");
  const [winterChampionId, setWinterChampionId] = useState<number | "">("");
  const [kingsCupChampionId, setKingsCupChampionId] = useState<number | "">("");
  const [leagueChampionId, setLeagueChampionId] = useState<number | "">("");
  const [uefaChampionId, setUefaChampionId] = useState<number | "">("");
  const [championsLeagueChampionId, setChampionsLeagueChampionId] = useState<number | "">("");
  const [bestGoalkeeperId, setBestGoalkeeperId] = useState<number | "">("");

  const [championsPositionIds, setChampionsPositionIds] = useState<number[]>([]);
  const [uefaPositionIds, setUefaPositionIds] = useState<number[]>([]);
  const [demotionPositionIds, setDemotionPositionIds] = useState<number[]>([]);

  function formatSeasonLabel(season: { name: string; league: { name: string } }) {
    return `${season.league.name} / ${season.name}`;
  }

  async function load() {
    const res = await fetch("/api/backend/api/admin/bootstrap", { cache: "no-store" });
    if (!res.ok) {
      setStatus("Failed loading admin data. Ensure your user is platform admin.");
      return;
    }

    const payload = (await res.json()) as BootstrapData;
    setData(payload);
  }

  useEffect(() => {
    void load();
  }, []);

  async function send(path: string, body: unknown) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      setStatus(`Save failed (${res.status}): ${errorText || "Unknown error"}`);
      return;
    }

    setStatus("Saved");
    await load();
  }

  async function sendPut(path: string, body: unknown) {
    setStatus("Saving...");
    const res = await fetch(`/api/backend${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      setStatus(`Save failed (${res.status}): ${errorText || "Unknown error"}`);
      return;
    }

    setStatus("Saved");
    await load();
  }

  return (
    <main>
      <section className="card">
        <span className="kicker">Administration</span>
        <h1>Platform Admin Console</h1>
        <p>Create leagues, seasons, communities, competitions, teams, match days, and matches.</p>
      </section>

      <section className="grid cols-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Create League</h2>
          <input value={leagueName} onChange={(e) => setLeagueName(e.target.value)} placeholder="Name" />
          <input value={leagueDescription} onChange={(e) => setLeagueDescription(e.target.value)} placeholder="Description" />
          <button onClick={() => send("/api/admin/leagues", { name: leagueName, description: leagueDescription })}>
            Save league
          </button>
        </article>

        <article className="card">
          <h2>Create Season</h2>
          <select value={seasonLeagueId} onChange={(e) => setSeasonLeagueId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">League</option>
            {data?.leagues.map((league) => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
          <input value={seasonName} onChange={(e) => setSeasonName(e.target.value)} placeholder="Name" />
          <input value={seasonDescription} onChange={(e) => setSeasonDescription(e.target.value)} placeholder="Description" />
          <input value={seasonStartDate} onChange={(e) => setSeasonStartDate(e.target.value)} type="date" />
          <input value={seasonEndDate} onChange={(e) => setSeasonEndDate(e.target.value)} type="date" />
          <button
            onClick={() => {
              if (seasonLeagueId === "") return;
              void send("/api/admin/seasons", {
                leagueId: seasonLeagueId,
                name: seasonName,
                description: seasonDescription,
                startDate: `${seasonStartDate}T00:00:00.000Z`,
                endDate: `${seasonEndDate}T23:59:59.999Z`,
              });
            }}
          >
            Save season
          </button>
        </article>

        <article className="card">
          <h2>Create Community</h2>
          <input value={communityName} onChange={(e) => setCommunityName(e.target.value)} placeholder="Name" />
          <input value={communityDescription} onChange={(e) => setCommunityDescription(e.target.value)} placeholder="Description" />
          <button onClick={() => send("/api/admin/communities", { name: communityName, description: communityDescription })}>
            Save community
          </button>
        </article>
      </section>

      <section className="grid cols-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Create Competition</h2>
          <select value={competitionSeasonId} onChange={(e) => setCompetitionSeasonId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Season</option>
            {data?.seasons.map((s) => (
              <option key={s.id} value={s.id}>{formatSeasonLabel(s)}</option>
            ))}
          </select>
          <select value={competitionCommunityId} onChange={(e) => setCompetitionCommunityId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Community</option>
            {data?.communities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              if (competitionSeasonId === "" || competitionCommunityId === "") return;
              void send("/api/admin/competitions", {
                seasonId: competitionSeasonId,
                communityId: competitionCommunityId,
              });
            }}
          >
            Save competition
          </button>
        </article>

        <article className="card">
          <h2>Create Team</h2>
          <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team name" />
          <button onClick={() => send("/api/admin/teams", { name: teamName })}>Save team</button>
        </article>

        <article className="card">
          <h2>Create Player</h2>
          <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Player name" />
          <button onClick={() => send("/api/admin/players", { name: playerName })}>Save player</button>
        </article>
      </section>

      <section className="grid cols-2" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Create Match Day</h2>
          <select value={matchDayCompetitionId} onChange={(e) => setMatchDayCompetitionId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Competition</option>
            {data?.competitions.map((c) => (
              <option key={c.id} value={c.id}>{c.community.name} ({formatSeasonLabel(c.season)})</option>
            ))}
          </select>
          <input value={matchDayNumber} onChange={(e) => setMatchDayNumber(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Match day number" />
          <input value={matchDayStartDate} onChange={(e) => setMatchDayStartDate(e.target.value)} type="datetime-local" />
          <button
            onClick={() => {
              if (matchDayCompetitionId === "" || matchDayNumber === "" || !matchDayStartDate) return;
              void send(`/api/admin/competitions/${matchDayCompetitionId}/match-days`, {
                number: matchDayNumber,
                startDate: new Date(matchDayStartDate).toISOString(),
              });
            }}
          >
            Save match day
          </button>
        </article>

        <article className="card">
          <h2>Add Team To Season</h2>
          <select value={teamInSeasonSeasonId} onChange={(e) => setTeamInSeasonSeasonId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Season</option>
            {data?.seasons.map((s) => (
              <option key={s.id} value={s.id}>{formatSeasonLabel(s)}</option>
            ))}
          </select>
          <select value={teamInSeasonTeamId} onChange={(e) => setTeamInSeasonTeamId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Team</option>
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <label>
            <input type="checkbox" checked={spanishLeague} onChange={(e) => setSpanishLeague(e.target.checked)} /> Spanish League
          </label>
          <label>
            <input type="checkbox" checked={uefaLeague} onChange={(e) => setUefaLeague(e.target.checked)} /> UEFA League
          </label>
          <label>
            <input type="checkbox" checked={championsLeague} onChange={(e) => setChampionsLeague(e.target.checked)} /> Champions League
          </label>
          <label>
            <input type="checkbox" checked={kingsCup} onChange={(e) => setKingsCup(e.target.checked)} /> Kings Cup
          </label>
          <button
            onClick={() => {
              if (teamInSeasonSeasonId === "" || teamInSeasonTeamId === "") return;
              void send(`/api/admin/seasons/${teamInSeasonSeasonId}/teams/${teamInSeasonTeamId}`, {
                spanishLeague,
                uefaLeague,
                championsLeague,
                kingsCup,
              });
            }}
          >
            Add team to season
          </button>
        </article>

        <article className="card">
          <h2>Create Match</h2>
          <input value={matchDayId} onChange={(e) => setMatchDayId(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Match day id" />
          <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Home team</option>
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Away team</option>
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              if (matchDayId === "" || homeTeamId === "" || awayTeamId === "") return;
              void send(`/api/admin/match-days/${matchDayId}/matches`, {
                homeTeamId,
                foreignTeamId: awayTeamId,
              });
            }}
          >
            Save match
          </button>
        </article>

        <article className="card">
          <h2>Assign Player To Team In Season</h2>
          <select value={playerTeamInSeasonId} onChange={(e) => setPlayerTeamInSeasonId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Team in season</option>
            {data?.teamInSeasons.map((item) => (
              <option key={item.id} value={item.id}>{item.team.name} ({formatSeasonLabel(item.season)})</option>
            ))}
          </select>
          <select value={playerId} onChange={(e) => setPlayerId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Player</option>
            {data?.players.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select value={playerPosition} onChange={(e) => setPlayerPosition(e.target.value as "GK" | "DF" | "MF" | "FW")}>
            <option value="GK">GK</option>
            <option value="DF">DF</option>
            <option value="MF">MF</option>
            <option value="FW">FW</option>
          </select>
          <button
            onClick={() => {
              if (playerTeamInSeasonId === "" || playerId === "") return;
              void send(`/api/admin/team-in-seasons/${playerTeamInSeasonId}/players`, {
                playerId,
                position: playerPosition,
              });
            }}
          >
            Assign player
          </button>
        </article>

        <article className="card">
          <h2>Set Match Result</h2>
          <select value={resultMatchId} onChange={(e) => setResultMatchId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Match</option>
            {data?.matches.map((m) => (
              <option key={m.id} value={m.id}>
                MD{m.matchDay.number}: {m.homeTeam.name} vs {m.foreignTeam.name}
              </option>
            ))}
          </select>
          <input value={resultHomeGoals} onChange={(e) => setResultHomeGoals(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Home goals" />
          <input value={resultAwayGoals} onChange={(e) => setResultAwayGoals(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Away goals" />
          <button
            onClick={() => {
              if (resultMatchId === "" || resultHomeGoals === "" || resultAwayGoals === "") return;
              void sendPut(`/api/admin/matches/${resultMatchId}/result`, {
                homeGoals: resultHomeGoals,
                foreignGoals: resultAwayGoals,
              });
            }}
          >
            Save result
          </button>
        </article>

        <article className="card">
          <h2>Set Player Goals (Match Day)</h2>
          <select value={goalsMatchDayId} onChange={(e) => setGoalsMatchDayId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Match day</option>
            {data?.matchDays.map((md) => (
              <option key={md.id} value={md.id}>MD{md.number} ({formatSeasonLabel(md.season)})</option>
            ))}
          </select>
          <select value={goalsPlayerId} onChange={(e) => setGoalsPlayerId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Player</option>
            {data?.players.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input value={goalsValue} onChange={(e) => setGoalsValue(e.target.value === "" ? "" : Number(e.target.value))} type="number" placeholder="Goals" />
          <button
            onClick={() => {
              if (goalsMatchDayId === "" || goalsPlayerId === "" || goalsValue === "") return;
              void sendPut(`/api/admin/match-days/${goalsMatchDayId}/player-goals`, {
                playerId: goalsPlayerId,
                goals: goalsValue,
              });
            }}
          >
            Save player goals
          </button>
        </article>

        <article className="card">
          <h2>Set Season Global Results</h2>
          <select value={globalResultsSeasonId} onChange={(e) => setGlobalResultsSeasonId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Season</option>
            {data?.seasons.map((s) => (
              <option key={s.id} value={s.id}>{formatSeasonLabel(s)}</option>
            ))}
          </select>
          <input value={globalResultsDeadline} onChange={(e) => setGlobalResultsDeadline(e.target.value)} type="datetime-local" />

          <select value={winterChampionId} onChange={(e) => setWinterChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Winter champion</option>
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select value={kingsCupChampionId} onChange={(e) => setKingsCupChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Kings cup champion</option>
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select value={leagueChampionId} onChange={(e) => setLeagueChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">League champion</option>
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select value={uefaChampionId} onChange={(e) => setUefaChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">UEFA champion</option>
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select value={championsLeagueChampionId} onChange={(e) => setChampionsLeagueChampionId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Champions league champion</option>
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select value={bestGoalkeeperId} onChange={(e) => setBestGoalkeeperId(e.target.value === "" ? "" : Number(e.target.value))}>
            <option value="">Best goalkeeper</option>
            {data?.players.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <label>Champions positions</label>
          <select
            multiple
            value={championsPositionIds.map(String)}
            onChange={(e) =>
              setChampionsPositionIds(
                Array.from(e.target.selectedOptions).map((option) => Number(option.value)),
              )
            }
          >
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <label>UEFA positions</label>
          <select
            multiple
            value={uefaPositionIds.map(String)}
            onChange={(e) =>
              setUefaPositionIds(
                Array.from(e.target.selectedOptions).map((option) => Number(option.value)),
              )
            }
          >
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <label>Demotion positions</label>
          <select
            multiple
            value={demotionPositionIds.map(String)}
            onChange={(e) =>
              setDemotionPositionIds(
                Array.from(e.target.selectedOptions).map((option) => Number(option.value)),
              )
            }
          >
            {data?.teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              if (globalResultsSeasonId === "" || !globalResultsDeadline) return;
              void sendPut(`/api/admin/seasons/${globalResultsSeasonId}/global-results`, {
                deadline: new Date(globalResultsDeadline).toISOString(),
                winterChampionId: winterChampionId === "" ? null : winterChampionId,
                kingsCupChampionId: kingsCupChampionId === "" ? null : kingsCupChampionId,
                leagueChampionId: leagueChampionId === "" ? null : leagueChampionId,
                uefaChampionId: uefaChampionId === "" ? null : uefaChampionId,
                championsLeagueChampionId:
                  championsLeagueChampionId === "" ? null : championsLeagueChampionId,
                bestGoalkeeperId: bestGoalkeeperId === "" ? null : bestGoalkeeperId,
                championsPositionIds,
                uefaPositionIds,
                demotionPositionIds,
              });
            }}
          >
            Save global results
          </button>
        </article>
      </section>

      {status ? <p style={{ marginTop: 16 }}>{status}</p> : null}
    </main>
  );
}
