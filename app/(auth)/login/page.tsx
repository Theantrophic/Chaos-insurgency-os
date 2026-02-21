"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales invalidas");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Iniciar sesion</h1>
        <p className="mt-2 text-sm text-slate-600">Google es el metodo recomendado y principal.</p>
      </div>

      <button className="kivo-button w-full" onClick={() => signIn("google", { callbackUrl: "/" })}>
        Continuar con Google
      </button>

      <form onSubmit={onSubmit} className="kivo-card space-y-4">
        <input className="kivo-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="kivo-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="kivo-button w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar con email"}</button>
      </form>
      <div className="text-sm text-slate-600">
        <a href="/register" className="text-kivo-purple">Crear cuenta</a> · <a href="/forgot-password" className="text-kivo-purple">Recuperar password</a>
      </div>
    </section>
  );
}