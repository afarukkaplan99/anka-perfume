"use client";

import Link from "next/link";

export default function HediyePaketleriPage() {
  return (
    <main style={page}>
      <div style={wrap}>
        <header style={{ textAlign: "center" }}>
          <h1 style={title}>Hediye Paketleri</h1>
          <p style={{ marginTop: 10, opacity: 0.78 }}>
            Standart veya Premium... paketini seç, hediye setini oluştur.
          </p>
        </header>

        <section style={grid}>
          <PackCard
            href="/hediye-paketleri/standart"
            badge="Standart"
            heading="Standart Paket"
            desc=""
            features={[
              "7 Farklı Esans Seçimi",
              "Şık Standart Şişe",
              "Hızlı & pratik hazırlanma",
            ]}
          />

          <PackCard
            href="/hediye-paketleri/premium"
            badge="Premium"
            heading="Premium Paket"
            desc=""
            features={[
              "11 Farklı esans seçimi",
              "Ultra lüx şişe seçimi",
              "Daha özel deneyim",
            ]}
          />
        </section>

        <div style={{ textAlign: "center", marginTop: 6 }}>
          <Link href="/magaza" style={backLink}>
            ← Mağazaya dön
          </Link>
        </div>
      </div>
    </main>
  );
}

function PackCard({
  href,
  badge,
  heading,
  desc,
  features,
}: {
  href: string;
  badge: string;
  heading: string;
  desc: string;
  features: string[];
}) {
  return (
    <Link
      href={href}
      style={card}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = "translateY(-3px)";
        el.style.borderColor = "rgba(212,175,55,0.70)";
        el.style.background = "rgba(212,175,55,0.10)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = "translateY(0px)";
        el.style.borderColor = "rgba(212,175,55,0.28)";
        el.style.background = "rgba(0,0,0,0.32)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={badgeStyle}>{badge}</span>
        <span style={{ color: "#d4af37", fontWeight: 900, fontSize: 18 }}>→</span>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={cardTitle}>{heading}</div>
        <div style={cardDesc}>{desc}</div>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
        {features.map((f) => (
          <div key={f} style={feat}>
            <span style={dot} />
            <span style={{ opacity: 0.9 }}>{f}</span>
          </div>
        ))}
      </div>
    </Link>
  );
}

/* ---------------- STYLES ---------------- */

const page: React.CSSProperties = {
  minHeight: "100dvh",
  background: "radial-gradient(1200px 600px at top, #2a0f3f, #09040c)",
  display: "flex",
  justifyContent: "center",
  padding: "70px 24px",
  color: "white",
  overflowX: "hidden",
};

const wrap: React.CSSProperties = {
  width: "100%",
  maxWidth: 980,
  display: "grid",
  gap: 18,
};

const title: React.CSSProperties = {
  margin: 0,
  color: "#d4af37",
  fontSize: 42,
  letterSpacing: 0.4,
};

const grid: React.CSSProperties = {
  marginTop: 10,
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
};

const card: React.CSSProperties = {
  textDecoration: "none",
  color: "white",
  border: "1px solid rgba(212,175,55,0.28)",
  borderRadius: 28,
  padding: 22,
  background: "rgba(0,0,0,0.32)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
  transition: "all .15s ease",
  display: "block",
  minHeight: 210,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid rgba(212,175,55,0.40)",
  color: "#d4af37",
  fontWeight: 900,
  fontSize: 12,
  letterSpacing: 0.6,
  background: "rgba(0,0,0,0.22)",
};

const cardTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 950,
  letterSpacing: 0.2,
};

const cardDesc: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  opacity: 0.78,
  lineHeight: 1.7,
  maxWidth: 460,
};

const feat: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 13,
};

const dot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: "#d4af37",
  boxShadow: "0 0 0 3px rgba(0,0,0,0.22)",
};

const backLink: React.CSSProperties = {
  color: "#d4af37",
  textDecoration: "none",
  border: "1px solid rgba(212,175,55,0.30)",
  padding: "10px 14px",
  borderRadius: 999,
  background: "rgba(0,0,0,0.25)",
  display: "inline-block",
};
