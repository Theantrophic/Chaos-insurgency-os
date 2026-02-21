"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });

    if (!res.ok) {
      setError("Token invalido o expirado");
      return;
    }

    setOk(true);
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-semibold">Restablecer password</h1>
      <form onSubmit={onSubmit} className="kivo-card space-y-4">
        <input className="kivo-input" type="password" placeholder="Nuevo password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {ok && <p className="text-sm text-green-600">Password actualizado.</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="kivo-button w-full" type="submit">Actualizar</button>
      </form>
    </section>
  );
}