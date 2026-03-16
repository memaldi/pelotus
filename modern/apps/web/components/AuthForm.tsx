"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

type AuthFormProps = {
  mode: Mode;
};

function setSessionCookies(payload: {
  token: string;
  user: { id: number; username: string; email: string; isPlatformAdmin?: boolean };
}) {
  const encodedUser = btoa(JSON.stringify(payload.user))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  document.cookie = `pelotus_user=${encodedUser}; Path=/; SameSite=Lax`;
  document.cookie = `pelotus_token=${payload.token}; Path=/; SameSite=Lax`;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState("");

  function onTextChange(setter: (value: string) => void) {
    return (event: ChangeEvent<HTMLInputElement>) => setter(event.target.value);
  }

  async function submit() {
    setStatus("Saving...");
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body =
      mode === "login"
        ? { username, password }
        : { username, email, password, passwordConfirmation };

    const res = await fetch(`/api/backend${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setStatus("Request failed");
      return;
    }

    const payload = await res.json();
    setSessionCookies(payload);
    setStatus("Success");
    router.push(payload.user?.isPlatformAdmin ? "/admin" : "/registration/community");
    router.refresh();
  }

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <h1>{mode === "login" ? "Login" : "Create account"}</h1>
      <div className="grid" style={{ gap: 12 }}>
        <input value={username} onChange={onTextChange(setUsername)} placeholder="Username" />
        {mode === "register" ? (
          <input value={email} onChange={onTextChange(setEmail)} placeholder="Email" type="email" />
        ) : null}
        <input value={password} onChange={onTextChange(setPassword)} placeholder="Password" type="password" />
        {mode === "register" ? (
          <input
            value={passwordConfirmation}
            onChange={onTextChange(setPasswordConfirmation)}
            placeholder="Confirm password"
            type="password"
          />
        ) : null}
      </div>
      <button onClick={submit} style={{ marginTop: 12 }}>
        {mode === "login" ? "Login" : "Create account"}
      </button>
      {status ? <p>{status}</p> : null}
    </div>
  );
}
