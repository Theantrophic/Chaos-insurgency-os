"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (!res.ok) {
      setError("No se pudo crear la cuenta");
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    setOk(true);
    router.push("/");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-semibold">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="kivo-card space-y-4">
        <input className="kivo-input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="kivo-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="kivo-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {ok && <p className="text-sm text-green-600">Cuenta creada.</p>}
        <button className="kivo-button w-full" type="submit">Registrarme</button>
      </form>
    </section>
  );
}