import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function JoinPage() {
  return (
    <main>
      <AuthForm mode="register" />
      <p style={{ marginTop: 16 }}>
        Already have an account? <Link className="link" href="/login">Login</Link>
      </p>
    </main>
  );
}
