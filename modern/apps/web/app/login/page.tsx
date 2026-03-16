import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main>
      <AuthForm mode="login" />
      <p style={{ marginTop: 16 }}>
        Need an account? <Link className="link" href="/join">Create one</Link>
      </p>
    </main>
  );
}
