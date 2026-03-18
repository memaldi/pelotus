import { LeagueWorkspace } from "@/components/admin/LeagueWorkspace";

export default async function AdminLeagueWorkspacePage({ params }: { params: Promise<{ leagueId: string }> }) {
  const { leagueId } = await params;
  const parsedLeagueId = Number(leagueId);

  return <LeagueWorkspace leagueId={parsedLeagueId} />;
}