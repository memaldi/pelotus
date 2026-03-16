import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionUser = {
  id: number;
  username: string;
  email: string;
  isPlatformAdmin?: boolean;
};

function decodeCookieValue(value: string) {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get("pelotus_user")?.value;
  if (!raw) {
    return null;
  }

  return decodeCookieValue(raw) as SessionUser | null;
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
