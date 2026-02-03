"use client";

import Link from "next/link";
import HeroVideo from "../HeroVideo";

export default function MagazaPage() {
  return (
    <main
      style={{
        height: "100dvh",          // ✅ tek ekran
        position: "relative",
        overflow: "hidden",        // ✅ iç scrollbar asla oluşmaz
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "white",
      }}
    >
      {/* VIDEO BACKGROUND */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <HeroVideo />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(1200px 600px at top, rgba(42,15,63,0.55), rgba(9,4,12,0.70))",
          }}
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 900,
          display: "flex",
          gap: 24,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <CardButton href="/olustur" title="Parfümünü Oluştur" desc="Kendi kokunu tasarla" />
        <CardButton href="/urunler" title="Ürünler" desc="Seçkin Notalar, Kusursuz Denge." />
        <CardButton href="/hediye-paketleri" title="Hediye Paketleri" desc="Hediyenin En Zarif Hali." />
      </div>
    </main>
  );
}

function CardButton({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        width: 240,
        height: 160,
        borderRadius: 28,
        border: "1px solid rgba(212,175,55,0.4)",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        color: "white",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = "translateY(-4px)";
        el.style.background = "rgba(212,175,55,0.12)";
        el.style.borderColor = "#d4af37";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = "translateY(0)";
        el.style.background = "rgba(0,0,0,0.35)";
        el.style.borderColor = "rgba(212,175,55,0.4)";
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#d4af37",
          textAlign: "center",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 13,
          opacity: 0.75,
          textAlign: "center",
        }}
      >
        {desc}
      </div>
    </Link>
  );
}
