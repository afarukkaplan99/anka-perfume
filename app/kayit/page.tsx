"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function KayitPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length >= 6 && !loading;
  }, [email, password, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        setError(
          json?.error === "EMAIL_IN_USE"
            ? "Bu e-posta zaten kayıtlı."
            : json?.error === "PASSWORD_TOO_SHORT"
              ? "Şifre en az 6 karakter olmalı."
              : "Kayıt başarısız."
        );
        return;
      }
      router.push("/hesabim");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "120px 16px 60px",
        background:
          "radial-gradient(900px 500px at 70% 10%, rgba(212,175,55,0.10), transparent 55%), linear-gradient(180deg, #07030b, #020104)",
      }}
    >
      <div
        style={{
          width: "min(560px, 100%)",
          borderRadius: 22,
          border: "1px solid rgba(212,175,55,0.22)",
          background: "rgba(0,0,0,0.35)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
          backdropFilter: "blur(12px)",
          padding: "28px 22px",
        }}
      >
        <h1 style={{ margin: 0, color: "#d4af37", fontSize: 30, letterSpacing: "0.6px" }}>
          Kayıt Ol
        </h1>
        <p style={{ margin: "10px 0 0", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
          Yeni hesabını oluştur. (Şifre en az 6 karakter)
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 22, display: "grid", gap: 14 }}>
          <Field label="Ad Soyad (opsiyonel)">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              autoComplete="name"
              placeholder="Faruk Kaplan"
              style={inputStyle}
            />
          </Field>

          <Field label="E-posta">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="ornek@mail.com"
              style={inputStyle}
            />
          </Field>

          <Field label="Şifre">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              placeholder="••••••"
              style={inputStyle}
            />
          </Field>

          {error && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                border: "1px solid rgba(255,100,100,0.35)",
                background: "rgba(255,0,0,0.08)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              {error}
            </div>
          )}

          <button
            disabled={!canSubmit}
            type="submit"
            style={{
              height: 48,
              borderRadius: 999,
              border: "1px solid rgba(212,175,55,0.35)",
              background: canSubmit
                ? "linear-gradient(90deg, rgba(212,175,55,0.95), rgba(255,255,255,0.15))"
                : "rgba(255,255,255,0.08)",
              color: canSubmit ? "#120816" : "rgba(255,255,255,0.55)",
              fontWeight: 700,
              letterSpacing: "0.4px",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "transform .15s ease, opacity .15s ease",
            }}
          >
            {loading ? "Kaydediliyor…" : "Kayıt Ol"}
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 6 }}>
            <Link href="/giris" style={linkStyle}>
              Zaten hesabın var mı? Giriş Yap
            </Link>
            <Link href="/" style={linkStyle}>
              Ana sayfa
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  height: 46,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.18)",
  color: "rgba(255,255,255,0.92)",
  padding: "0 14px",
  outline: "none",
};

const linkStyle: React.CSSProperties = {
  color: "rgba(212,175,55,0.95)",
  textDecoration: "none",
  fontSize: 14,
  letterSpacing: "0.3px",
};
