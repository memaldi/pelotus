import { CommunityOnboarding } from "@/components/CommunityOnboarding";
import { requireSessionUser } from "@/lib/session";

export default async function RegistrationCommunityPage() {
  await requireSessionUser();
  return <CommunityOnboarding />;
}
