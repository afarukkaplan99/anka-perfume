"use client";

import Link from "next/link";

export default function OdemeBasariliPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "90px 24px",
        background: "radial-gradient(1200px 600px at top, #2a0f3f, #09040c)",
        color: "white",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ color: "#d4af37", fontSize: 46, margin: 0 }}>
          Sipariş Alındı
        </h1>

        <p style={{ marginTop: 18, opacity: 0.8, fontSize: 18, lineHeight: 1.7 }}>
          Ödeme işlemi (demo) başarıyla tamamlandı. Sepetin sıfırlandı.
          <br />
          Gerçek ödeme sistemini bir sonraki adımda bağlayacağız.
        </p>

        <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/magaza"
            style={{
              color: "#08040b",
              textDecoration: "none",
              background: "#d4af37",
              padding: "14px 18px",
              borderRadius: 999,
              fontWeight: 800,
            }}
          >
            Mağazaya Dön
          </Link>

          <Link
            href="/"
            style={{
              color: "#d4af37",
              textDecoration: "none",
              border: "1px solid rgba(212,175,55,0.35)",
              padding: "14px 18px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.25)",
              fontWeight: 700,
            }}
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </main>
  );
}
