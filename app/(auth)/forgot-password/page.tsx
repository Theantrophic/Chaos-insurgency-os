"use client";

import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    setSent(true);
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-semibold">Recuperar password</h1>
      <form onSubmit={onSubmit} className="kivo-card space-y-4">
        <input className="kivo-input" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {sent && <p className="text-sm text-green-600">Si existe la cuenta, enviamos instrucciones.</p>}
        <button className="kivo-button w-full" type="submit">Enviar enlace</button>
      </form>
    </section>
  );
}