import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.INTERNAL_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:4000";

async function createAuthHeaders() {
  const store = await cookies();
  const token = store.get("pelotus_token")?.value;
  const headers = new Headers();
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }
  return headers;
}

export type Player = {
  id: number;
  name: string;
};

export async function fetchPlayersByTeamSeasonPosition(params: {
  teamId: number;
  seasonId: number;
  position: "GK" | "DF" | "MF" | "FW";
}) {
  const headers = await createAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/api/team/${params.teamId}/season/${params.seasonId}/player/position/${params.position}`,
    { cache: "no-store", headers },
  );

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`);
  }

  return (await res.json()) as Player[];
}

export async function fetchUserMatchDayPoints(params: {
  competitionId: number;
  matchDayId: number;
}) {
  const headers = await createAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/api/scoring/competition/${params.competitionId}/match-day/${params.matchDayId}`,
    { cache: "no-store", headers },
  );

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`);
  }

  return (await res.json()) as { points: number };
}

export async function fetchDashboard(competitionId: number) {
  const headers = await createAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/competitions/${competitionId}/dashboard`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`);
  }

  return res.json();
}

export async function fetchMatchDays(competitionId: number) {
  const headers = await createAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/competitions/${competitionId}/match-days`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`);
  }

  return res.json();
}

export async function fetchMatchDay(competitionId: number, matchDayId: number) {
  const headers = await createAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/competitions/${competitionId}/match-days/${matchDayId}`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`);
  }

  return res.json();
}

export async function fetchScorers(competitionId: number, matchDayId: number) {
  const headers = await createAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/competitions/${competitionId}/match-days/${matchDayId}/scorers`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`);
  }

  return res.json();
}

export async function fetchGlobalBets(competitionId: number) {
  const headers = await createAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/competitions/${competitionId}/global-bets`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`);
  }

  return res.json();
}

export async function fetchMatchDayRanking(competitionId: number, matchDayId: number) {
  const headers = await createAuthHeaders();
  const res = await fetch(
    `${API_BASE_URL}/api/competitions/${competitionId}/match-days/${matchDayId}/ranking`,
    { cache: "no-store", headers },
  );

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`);
  }

  return res.json();
}

export async function fetchGlobalRanking(competitionId: number) {
  const headers = await createAuthHeaders();
  const res = await fetch(`${API_BASE_URL}/api/competitions/${competitionId}/global-ranking`, {
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    throw new Error(`API request failed with ${res.status}`);
  }

  return res.json();
}
