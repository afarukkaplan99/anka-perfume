"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CART_KEY = "anka_cart";
const MAX_SELECT = 7;
const PRICE_STANDART = 21999;

/* ---------- ESANSLAR ---------- */

const ESANSLAR = [
  "Bergamot",
  "Limon",
  "Greyfurt",
  "Lavanta",
  "Gül",
  "Yasemin",
  "Vanilya",
  "Amber",
  "Misk",
  "Sandal Ağacı",
  "Paçuli",
  "Vetiver",
  "Tarçın",
  "Safran",
  "Oud",
];

/* ---------- ŞİŞELER (Premium ile aynı yapı) ---------- */

type Bottle = {
  id: string;
  title: string;
  desc: string;
  priceDelta: number;
  image?: string; // ✅ sadece görsel eklemek için
};

const BOTTLES: Bottle[] = [
  {
    id: "bottle_gold",
    title: "Blue Gold",
    desc: "Zarif ve klasik görünüm.",
    priceDelta: 0,
    image: "/gift-bottles/standard-bottle.png", // ✅ public/ içi → / ile başlar
  },
  {
    id: "bottle_black",
    title: "White Onyx",
    desc: "Modern ve sade tasarım.",
    priceDelta: 0,
    image: "/gift-bottles/standard-bottle-1 .png", // ✅ dosya adında boşluk var (senin yazdığın gibi)
  },
];

/* ---------- PAGE ---------- */

export default function StandartHediyePaketi() {
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>([]);
  const [bottleId, setBottleId] = useState<string>("");

  // ✅ Premium UX mikro-etkileşimler / durumlar
  const [toast, setToast] = useState<{ open: boolean; title: string; desc?: string; tone?: "ok" | "warn" | "info" }>(
    { open: false, title: "", desc: "", tone: "info" }
  );
  const [justAdded, setJustAdded] = useState(false);
  const toastTimer = useRef<number | null>(null);

  const showToast = (t: { title: string; desc?: string; tone?: "ok" | "warn" | "info" }) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ open: true, ...t });
    toastTimer.current = window.setTimeout(() => setToast((p) => ({ ...p, open: false })), 2600);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const toggle = (name: string) => {
    setSelected((prev) => {
      if (prev.includes(name)) {
        const next = prev.filter((x) => x !== name);
        showToast({ title: "Esans kaldırıldı", desc: name, tone: "info" });
        return next;
      }
      if (prev.length >= MAX_SELECT) {
        showToast({
          title: "Limit dolu",
          desc: `En fazla ${MAX_SELECT} esans seçebilirsin.`,
          tone: "warn",
        });
        return prev;
      }
      const next = [...prev, name];
      showToast({ title: "Esans eklendi", desc: name, tone: "ok" });
      return next;
    });
  };

  const bottle = useMemo(() => BOTTLES.find((b) => b.id === bottleId) || null, [bottleId]);

  const totalPrice = useMemo(() => PRICE_STANDART + (bottle?.priceDelta || 0), [bottle]);

  const canContinue = bottleId && selected.length === MAX_SELECT;

  const progress = useMemo(() => {
    const s = Math.min(1, selected.length / MAX_SELECT);
    const b = bottleId ? 1 : 0;
    // şişe + esanslar (2 aşama) -> premium progress
    return Math.round(((b * 0.35 + s * 0.65) * 100 + Number.EPSILON) * 100) / 100;
  }, [selected.length, bottleId]);

  const addToCart = () => {
    if (!canContinue) {
      // ✅ Premium guardrails
      if (!bottleId) showToast({ title: "Önce şişeni seç", desc: "Şişe seçimi zorunludur.", tone: "warn" });
      else showToast({ title: "Seçim tamamlanmadı", desc: `Tam ${MAX_SELECT} esans seçmelisin.`, tone: "warn" });
      return;
    }

    const item = {
      id: "gift_std_" + Date.now(),
      createdAt: Date.now(),

      // ✅ Sepet için gerekli alanlar
      kind: "gift",
      tier: "standard",
      title: "Standart Paket",

      // ✅ Şişe artık object (sepette doğru görünür)
      bottle: bottle ? { id: bottle.id, name: bottle.title } : undefined,

      essences: selected,
      price: totalPrice,
    };

    const raw = localStorage.getItem(CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(item);
    localStorage.setItem(CART_KEY, JSON.stringify(arr));
    window.dispatchEvent(new Event("cart_updated"));

    // ✅ Premium feedback
    setJustAdded(true);
    showToast({ title: "Sepete eklendi", desc: "Standart Paket hazır.", tone: "ok" });

    // mevcut davranışı koru: sepete yönlendir
    router.push("/sepet");
  };

  const resetAll = () => {
    setBottleId("");
    setSelected([]);
    showToast({ title: "Seçimler sıfırlandı", desc: "Yeni bir kombinasyon oluşturabilirsin.", tone: "info" });
  };

  return (
    <main style={page}>
      {/* Ambient glow + premium grain */}
      <div aria-hidden style={ambientA} />
      <div aria-hidden style={ambientB} />
      <div aria-hidden style={grain} />

      <div style={wrap}>
        <header style={hero}>
          <div style={heroTopRow}>
            <div style={badge}>
              <span style={badgeDot} />
              Hediyelik Seri • Standart
            </div>

            <button onClick={resetAll} style={ghostBtn} title="Seçimleri Sıfırla">
              Sıfırla
              <span style={ghostHint}>↺</span>
            </button>
          </div>

          <h1 style={title}>Standart Hediye Paketi</h1>

          <p style={subtitle}>
            Önce <b>şişeni seç</b>, ardından kutuya girecek <b>{MAX_SELECT} esansı</b> belirle. Seçimlerin, kutu içi
            deneyiminle uyumlu olacak şekilde dengelenir.
          </p>

          {/* Premium progress */}
          <div style={progressWrap}>
            <div style={progressTop}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <span style={progressLabel}>İlerleme</span>
                <span style={progressMeta}>
                  Şişe:{" "}
                  <b style={{ color: bottle ? "#d4af37" : "rgba(255,255,255,0.7)" }}>{bottle ? "Seçildi" : "Seçilmedi"}</b>{" "}
                  • Esans:{" "}
                  <b
                    style={{
                      color: selected.length === MAX_SELECT ? "#d4af37" : "rgba(255,255,255,0.7)",
                    }}
                  >
                    {selected.length}/{MAX_SELECT}
                  </b>
                </span>
              </div>
              <div style={pricePill}>
                <span style={{ opacity: 0.75, fontSize: 12 }}>Toplam</span>
                <span style={{ fontWeight: 950, letterSpacing: 0.2 }}>{totalPrice.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>

            <div style={progressTrack} aria-label="İlerleme Çubuğu">
              <div
                style={{
                  ...progressFill,
                  width: `${Math.max(6, progress)}%`,
                }}
              />
            </div>
          </div>
        </header>

        {/* ŞİŞE SEÇİMİ */}
        <section style={card}>
          <div style={sectionHeader}>
            <div style={sectionTitle}>1) Şişe Seçimi</div>
            <div style={sectionHint}>Kutunun karakterini belirler • Zorunlu</div>
          </div>

          <div style={bottleGrid}>
            {BOTTLES.map((b) => {
              const active = b.id === bottleId;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setBottleId(b.id);
                    showToast({ title: "Şişe seçildi", desc: b.title, tone: "ok" });
                  }}
                  style={{
                    ...bottleCard,
                    borderColor: active ? "rgba(212,175,55,0.75)" : "rgba(212,175,55,0.26)",
                    background: active ? "linear-gradient(180deg, rgba(212,175,55,0.18), rgba(0,0,0,0.34))" : glass,
                    transform: active ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: active ? "0 22px 55px rgba(0,0,0,0.55)" : "0 18px 44px rgba(0,0,0,0.45)",
                  }}
                >
                  <div style={bottleTop}>
                    <div style={{ display: "grid", gap: 4 }}>
                      <div style={{ fontWeight: 950, fontSize: 16, letterSpacing: 0.2 }}>{b.title}</div>
                      <div style={{ opacity: 0.78, fontSize: 13, lineHeight: 1.35 }}>{b.desc}</div>
                    </div>

                    {/* ✅ SADECE GÖRSEL EKLENDİ (ikon yerine) */}
                    <div
                      aria-hidden
                      style={{
                        ...bottleIcon,
                        outlineColor: active ? "rgba(212,175,55,0.55)" : "rgba(212,175,55,0.20)",
                        transform: active ? "rotate(-6deg)" : "rotate(0deg)",
                        overflow: "hidden",
                        padding: 0,
                        background: "transparent",
                      }}
                    >
                      {b.image ? (
                        <Image
                          src={b.image}
                          alt={b.title}
                          width={44}
                          height={44}
                          draggable={false}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            borderRadius: 16,
                            userSelect: "none",
                            pointerEvents: "none",
                            filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.45))",
                          }}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div style={bottleBottom}>
                    <div style={bottleTag}>{active ? "Seçildi" : "Seç"}</div>
                    <div style={{ color: "#d4af37", fontWeight: 950, letterSpacing: 0.2 }}>
                      {b.priceDelta === 0 ? "Dahil" : `+ ${b.priceDelta.toLocaleString("tr-TR")} ₺`}
                    </div>
                  </div>

                  {active && <div aria-hidden style={activeGlow} />}
                </button>
              );
            })}
          </div>

          <div style={noteLine}>
            <span style={noteDot} />
            Standart pakette şişe seçimi zorunludur.
          </div>
        </section>

        {/* ESANS SEÇİMİ */}
        <section style={card}>
          <div style={sectionHeader}>
            <div style={sectionTitle}>2) Esans Seçimi</div>
            <div style={sectionHint}>Kutunun içeriğini belirler • Tam {MAX_SELECT} seçim</div>
          </div>

          <div style={metaRow}>
            <div style={countPill}>
              <span style={{ opacity: 0.75 }}>Seçim</span>
              <span style={{ fontWeight: 950 }}>
                {selected.length}/{MAX_SELECT}
              </span>
            </div>

            <div style={helperText}>
              Dengeli bir profil için: <b>1–2</b> üst nota, <b>2–3</b> orta nota, <b>2–3</b> baz nota önerilir.
            </div>
          </div>

          <div style={grid}>
            {ESANSLAR.map((e) => {
              const active = selected.includes(e);
              const disabled = !active && selected.length >= MAX_SELECT;

              return (
                <button
                  key={e}
                  onClick={() => toggle(e)}
                  disabled={disabled}
                  style={{
                    ...essence,
                    borderColor: active ? "rgba(212,175,55,0.85)" : "rgba(212,175,55,0.30)",
                    background: active ? "rgba(212,175,55,0.18)" : "rgba(0,0,0,0.30)",
                    opacity: disabled ? 0.45 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                    transform: active ? "translateY(-1px)" : "translateY(0px)",
                  }}
                  aria-pressed={active}
                  title={disabled ? `Limit dolu (${MAX_SELECT})` : e}
                >
                  <span style={essenceInner}>
                    <span style={{ fontWeight: 850 }}>{e}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {active ? <span style={checkMark}>✓</span> : <span style={miniDot} />}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div style={noteLine}>
            <span style={noteDot} />
            {MAX_SELECT}’den fazla seçemezsin. Seçimini tamamlamak için tam {MAX_SELECT} esans belirle.
          </div>
        </section>

        {/* ALT BAR */}
        <div style={footer}>
          <div style={summaryBox}>
            <div style={summaryRow}>
              <span style={summaryLabel}>Şişe</span>
              <span style={summaryValue}>{bottle ? bottle.title : "Seçilmedi"}</span>
            </div>
            <div style={summaryRow}>
              <span style={summaryLabel}>Esans</span>
              <span style={summaryValue}>
                {selected.length}/{MAX_SELECT}
              </span>
            </div>
          </div>

          <div style={footerRight}>
            <button
              onClick={() => {
                if (!bottleId)
                  showToast({ title: "Şişe seçmeden ilerleyemezsin", desc: "Önce şişeni seç.", tone: "warn" });
                else showToast({ title: "Devam için tamamla", desc: `Tam ${MAX_SELECT} esans seçmelisin.`, tone: "info" });
              }}
              style={{
                ...secondaryBtn,
                opacity: canContinue ? 0.7 : 1,
              }}
              title="Seçim ipuçları"
            >
              İpucu
            </button>

            <button
              disabled={!canContinue}
              onClick={addToCart}
              style={{
                ...cta,
                opacity: canContinue ? 1 : 0.35,
                cursor: canContinue ? "pointer" : "not-allowed",
                transform: canContinue ? "translateY(-1px)" : "translateY(0px)",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span style={ctaSpark} aria-hidden />
                Sepete Ekle
              </span>
              <span style={ctaPrice}>{totalPrice.toLocaleString("tr-TR")} ₺</span>
            </button>
          </div>
        </div>

        {/* TOAST */}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            ...toastWrap,
            pointerEvents: toast.open ? "auto" : "none",
            opacity: toast.open ? 1 : 0,
            transform: toast.open ? "translateY(0px)" : "translateY(10px)",
          }}
        >
          <div
            style={{
              ...toastCard,
              borderColor:
                toast.tone === "ok"
                  ? "rgba(212,175,55,0.55)"
                  : toast.tone === "warn"
                  ? "rgba(255,166,87,0.45)"
                  : "rgba(212,175,55,0.26)",
            }}
          >
            <div style={toastTop}>
              <span
                style={{
                  ...toastDot,
                  background:
                    toast.tone === "ok"
                      ? "rgba(212,175,55,1)"
                      : toast.tone === "warn"
                      ? "rgba(255,166,87,1)"
                      : "rgba(255,255,255,0.75)",
                }}
              />
              <div style={{ display: "grid", gap: 2 }}>
                <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>{toast.title}</div>
                {toast.desc ? <div style={{ opacity: 0.78, fontSize: 12 }}>{toast.desc}</div> : null}
              </div>

              <button
                onClick={() => setToast((p) => ({ ...p, open: false }))}
                style={toastClose}
                aria-label="Bildirimi kapat"
              >
                ✕
              </button>
            </div>

            <div style={toastBarTrack} aria-hidden>
              <div style={toastBarFill} />
            </div>
          </div>
        </div>

        {/* Tiny success pulse (sepete ekleme) */}
        {justAdded && <div aria-hidden style={successPulse} />}
      </div>
    </main>
  );
}

/* ---------------- STYLES ---------------- */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(1200px 600px at top, #2a0f3f, #09040c)",
  display: "flex",
  justifyContent: "center",
  padding: "60px 24px",
  color: "white",
  position: "relative",
  overflow: "hidden",
};

const wrap: React.CSSProperties = {
  width: "100%",
  maxWidth: 980,
  display: "grid",
  gap: 18,
  position: "relative",
  zIndex: 2,
};

const title: React.CSSProperties = {
  margin: 0,
  color: "#d4af37",
  fontSize: 42,
  letterSpacing: -0.6,
  lineHeight: 1.05,
  textShadow: "0 18px 55px rgba(0,0,0,0.45)",
};

const subtitle: React.CSSProperties = {
  opacity: 0.78,
  maxWidth: 780,
  margin: "10px auto 0",
  lineHeight: 1.6,
  fontSize: 14,
};

const card: React.CSSProperties = {
  border: "1px solid rgba(212,175,55,0.22)",
  borderRadius: 28,
  padding: 18,
  background: "rgba(0,0,0,0.30)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.48)",
  position: "relative",
  overflow: "hidden",
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const sectionTitle: React.CSSProperties = {
  color: "#d4af37",
  fontWeight: 950,
  letterSpacing: 0.4,
  fontSize: 16,
};

const sectionHint: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.62,
  letterSpacing: 0.2,
};

const bottleGrid: React.CSSProperties = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
};

const glass = "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.35))";

const bottleCard: React.CSSProperties = {
  textAlign: "left",
  padding: 16,
  borderRadius: 24,
  border: "1px solid rgba(212,175,55,0.26)",
  background: glass,
  color: "white",
  cursor: "pointer",
  transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease",
  position: "relative",
  overflow: "hidden",
};

const bottleTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};

const bottleIcon: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 16,
  background:
    "radial-gradient(14px 14px at 30% 30%, rgba(212,175,55,0.55), rgba(212,175,55,0.10) 55%, rgba(0,0,0,0.0) 70%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.25))",
  outline: "1px solid rgba(212,175,55,0.20)",
  boxShadow: "0 16px 44px rgba(0,0,0,0.45)",
  transition: "transform .18s ease, outline-color .18s ease",
};

const bottleBottom: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
};

const bottleTag: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(212,175,55,0.30)",
  background: "rgba(0,0,0,0.20)",
  fontWeight: 950,
  letterSpacing: 0.2,
  fontSize: 12,
};

const activeGlow: React.CSSProperties = {
  position: "absolute",
  inset: -2,
  background:
    "radial-gradient(600px 220px at 20% 0%, rgba(212,175,55,0.18), rgba(0,0,0,0) 55%), radial-gradient(500px 240px at 90% 120%, rgba(212,175,55,0.12), rgba(0,0,0,0) 55%)",
  pointerEvents: "none",
};

const grid: React.CSSProperties = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
  gap: 12,
};

const essence: React.CSSProperties = {
  padding: "12px 12px",
  borderRadius: 18,
  border: "1px solid rgba(212,175,55,0.30)",
  color: "white",
  fontWeight: 750,
  background: "rgba(0,0,0,0.30)",
  transition: "transform .15s ease, border-color .15s ease, background .15s ease, opacity .15s ease",
};

const essenceInner: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const miniDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: "rgba(212,175,55,0.30)",
  boxShadow: "0 0 0 4px rgba(212,175,55,0.06)",
};

const checkMark: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  borderRadius: 999,
  border: "1px solid rgba(212,175,55,0.55)",
  background: "rgba(212,175,55,0.16)",
  color: "#d4af37",
  fontWeight: 950,
  boxShadow: "0 18px 44px rgba(0,0,0,0.45)",
};

const metaRow: React.CSSProperties = {
  marginTop: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const countPill: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(212,175,55,0.26)",
  background: "rgba(0,0,0,0.18)",
  display: "inline-flex",
  gap: 10,
  alignItems: "center",
};

const helperText: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.65,
  lineHeight: 1.5,
  maxWidth: 520,
};

const noteLine: React.CSSProperties = {
  marginTop: 12,
  fontSize: 12,
  opacity: 0.62,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const noteDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 999,
  background: "rgba(212,175,55,0.85)",
  boxShadow: "0 0 0 6px rgba(212,175,55,0.08)",
};

const footer: React.CSSProperties = {
  marginTop: 4,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
  padding: "6px 2px 0",
};

const summaryBox: React.CSSProperties = {
  display: "grid",
  gap: 8,
  padding: "12px 14px",
  borderRadius: 22,
  border: "1px solid rgba(212,175,55,0.20)",
  background: "rgba(0,0,0,0.22)",
  minWidth: 280,
};

const summaryRow: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 12,
};

const summaryLabel: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.62,
  letterSpacing: 0.2,
};

const summaryValue: React.CSSProperties = {
  color: "#d4af37",
  fontWeight: 950,
  letterSpacing: 0.2,
};

const footerRight: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const secondaryBtn: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 999,
  border: "1px solid rgba(212,175,55,0.22)",
  background: "rgba(0,0,0,0.22)",
  color: "white",
  fontWeight: 900,
  letterSpacing: 0.2,
  cursor: "pointer",
  transition: "all .15s ease",
};

const cta: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 999,
  border: "1px solid rgba(212,175,55,0.95)",
  background: "linear-gradient(180deg, #f2d57b, #d4af37)",
  color: "#08040b",
  fontWeight: 950,
  letterSpacing: 0.3,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 14,
  boxShadow: "0 26px 70px rgba(0,0,0,0.55)",
  transition: "transform .15s ease, opacity .15s ease, box-shadow .15s ease",
};

const ctaPrice: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(0,0,0,0.16)",
  border: "1px solid rgba(0,0,0,0.10)",
  fontWeight: 950,
};

const ctaSpark: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
  background: "rgba(0,0,0,0.22)",
  boxShadow: "0 0 0 5px rgba(0,0,0,0.08), 0 0 24px rgba(212,175,55,0.55), 0 0 60px rgba(212,175,55,0.25)",
};

const hero: React.CSSProperties = {
  textAlign: "center",
  padding: "10px 4px 0",
  position: "relative",
};

const heroTopRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 10,
};

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid rgba(212,175,55,0.22)",
  background: "rgba(0,0,0,0.18)",
  fontWeight: 900,
  letterSpacing: 0.2,
  fontSize: 12,
};

const badgeDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 999,
  background: "#d4af37",
  boxShadow: "0 0 0 6px rgba(212,175,55,0.10)",
};

const ghostBtn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontWeight: 900,
  letterSpacing: 0.2,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  transition: "all .15s ease",
};

const ghostHint: React.CSSProperties = {
  opacity: 0.75,
  fontWeight: 950,
};

const progressWrap: React.CSSProperties = {
  marginTop: 16,
  borderRadius: 26,
  border: "1px solid rgba(212,175,55,0.18)",
  background: "rgba(0,0,0,0.22)",
  padding: 14,
  maxWidth: 920,
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0 22px 60px rgba(0,0,0,0.40)",
};

const progressTop: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 10,
};

const progressLabel: React.CSSProperties = {
  fontWeight: 950,
  letterSpacing: 0.2,
  color: "#d4af37",
  fontSize: 12,
};

const progressMeta: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.7,
  lineHeight: 1.35,
};

const pricePill: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid rgba(212,175,55,0.22)",
  background: "rgba(0,0,0,0.18)",
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 2,
};

const progressTrack: React.CSSProperties = {
  height: 12,
  borderRadius: 999,
  background: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.10)",
  overflow: "hidden",
};

const progressFill: React.CSSProperties = {
  height: "100%",
  borderRadius: 999,
  background: "linear-gradient(90deg, rgba(212,175,55,0.35), rgba(212,175,55,0.95), rgba(255,255,255,0.20))",
  boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
  transition: "width .22s ease",
};

const toastWrap: React.CSSProperties = {
  position: "fixed",
  right: 18,
  bottom: 18,
  zIndex: 50,
  transition: "opacity .18s ease, transform .18s ease",
};

const toastCard: React.CSSProperties = {
  width: 320,
  borderRadius: 20,
  border: "1px solid rgba(212,175,55,0.26)",
  background: "rgba(0,0,0,0.60)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
  overflow: "hidden",
};

const toastTop: React.CSSProperties = {
  padding: 12,
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
};

const toastDot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
  marginTop: 6,
  boxShadow: "0 0 0 6px rgba(212,175,55,0.10)",
  flex: "0 0 auto",
};

const toastClose: React.CSSProperties = {
  marginLeft: "auto",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  borderRadius: 12,
  width: 30,
  height: 30,
  cursor: "pointer",
  fontWeight: 950,
};

const toastBarTrack: React.CSSProperties = {
  height: 3,
  background: "rgba(255,255,255,0.10)",
};

const toastBarFill: React.CSSProperties = {
  height: "100%",
  width: "100%",
  background: "linear-gradient(90deg, rgba(212,175,55,0.10), rgba(212,175,55,0.75))",
  animation: "anka_toast 2.6s linear forwards",
};

const ambientA: React.CSSProperties = {
  position: "absolute",
  inset: "-20%",
  background:
    "radial-gradient(900px 500px at 20% 10%, rgba(212,175,55,0.10), rgba(0,0,0,0) 55%), radial-gradient(900px 500px at 80% 0%, rgba(142,60,255,0.18), rgba(0,0,0,0) 60%)",
  filter: "blur(6px)",
  zIndex: 0,
};

const ambientB: React.CSSProperties = {
  position: "absolute",
  inset: "-20%",
  background:
    "radial-gradient(900px 500px at 80% 80%, rgba(212,175,55,0.08), rgba(0,0,0,0) 60%), radial-gradient(700px 450px at 10% 90%, rgba(255,255,255,0.04), rgba(0,0,0,0) 60%)",
  filter: "blur(10px)",
  zIndex: 0,
};

const grain: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.10'/%3E%3C/svg%3E\")",
  opacity: 0.25,
  mixBlendMode: "overlay",
  pointerEvents: "none",
  zIndex: 1,
};

const successPulse: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  background: "radial-gradient(800px 300px at 80% 80%, rgba(212,175,55,0.12), rgba(0,0,0,0) 60%)",
  animation: "anka_pulse 900ms ease-out forwards",
  zIndex: 40,
};

/* 🔸 Inline keyframes (Next/React inline style limitation workaround)
   Bu sayfa global CSS'e ihtiyaç duymasın diye küçük bir hack:
   style tag ekleyip keyframe tanımı basıyoruz.
*/
const keyframes = `
@keyframes anka_toast { 
  from { transform: translateX(-100%); } 
  to { transform: translateX(0%); } 
}
@keyframes anka_pulse { 
  0% { opacity: 0; } 
  15% { opacity: 1; } 
  100% { opacity: 0; } 
}
`;

/* ✅ Sayfaya keyframes enjekte (mevcut kodu bozmadan, tek parça) */
if (typeof document !== "undefined") {
  const id = "anka_std_gift_keyframes";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = keyframes;
    document.head.appendChild(style);
  }
}
