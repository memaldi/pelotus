import { redirect } from "next/navigation";

type Props = { params: Promise<{ competitionId: string }> };

export default async function CompetitionPage({ params }: Props) {
  const { competitionId } = await params;
  redirect(`/competitions/${competitionId}/dashboard`);
}
