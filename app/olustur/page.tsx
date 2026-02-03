"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type NoteKey = "top" | "mid" | "base";
type NoteOption = { name: string; color: string };

// fiyat
const PRICE_ALKOL = 7999;
const PRICE_YAG = 8499;

type BottleId = "classic" | "noir" | "atelier" | "royal";

/**
 * ✅ Sepet item'ında geriye dönük uyum önemli:
 * - Eski sepet sayfan topNote/midNote/baseNote bekliyorsa kırılmasın diye string alanları KORUDUK.
 * - Yeni çoklu seçim için topNotes/midNotes/baseNotes array alanlarını EKLEDİK.
 * - Kullanıcı isim verebilsin diye perfumeName EKLEDİK.
 */
type CartItem = {
  id: string;
  createdAt: number;

  topNote: string;
  midNote: string;
  baseNote: string;

  topNotes: string[];
  midNotes: string[];
  baseNotes: string[];

  perfumeName: string;

  ratios: { top: number; mid: number; base: number };
  baseType: "alkol" | "yag";
  price: number;
  bottleId: BottleId;
};

const CART_KEY = "anka_cart";

// fallback
const TOP_FALLBACK = "#f5e6b3";
const MID_FALLBACK = "#d4af37";
const BASE_FALLBACK = "#7a4a1f";

const BOTTLE_PNG = "/bottle.png";

/** ✅ Nota listeleri */
const TOP_NOTES: NoteOption[] = [
  { name: "Bergamot", color: "#B7E4C7" },
  { name: "Limon", color: "#FFF3B0" },
  { name: "Greyfurt", color: "#FFB4A2" },
  { name: "Mandarin", color: "#FFC857" },
  { name: "Neroli", color: "#FFE8A3" },
  { name: "Lavanta", color: "#CDB4DB" },
  { name: "Nane", color: "#B9FBC0" },
  { name: "Pembe Biber", color: "#FF5D8F" },
  { name: "Safran", color: "#F4A261" },
  { name: "Kakule", color: "#A7C957" },
  { name: "Zencefil", color: "#F6BD60" },
  { name: "Armut", color: "#D9ED92" },
  { name: "Yıldız Anason", color: "#90BE6D" },
  { name: "Portakal Çiçeği", color: "#FFE5EC" },
  { name: "Adaçayı", color: "#52B788" },
];

const MID_NOTES: NoteOption[] = [
  { name: "Gül", color: "#FF4D6D" },
  { name: "Yasemin", color: "#FFF1E6" },
  { name: "İris", color: "#BDE0FE" },
  { name: "Menekşe", color: "#9D4EDD" },
  { name: "Şakayık", color: "#FFAFCC" },
  { name: "Frezya", color: "#FEE440" },
  { name: "Ylang Ylang", color: "#FFD60A" },
  { name: "Tarçın", color: "#B56576" },
  { name: "Muskat", color: "#6D6875" },
  { name: "Karanfil", color: "#E63946" },
  { name: "Bal", color: "#FFB703" },
  { name: "Osmanthus", color: "#FAD2E1" },
  { name: "Sedir Yaprağı", color: "#84A98C" },
  { name: "Portakal Çiçeği", color: "#FFE5EC" },
  { name: "Amber Çiçeği", color: "#E9C46A" },
];

const BASE_NOTES: NoteOption[] = [
  { name: "Oud", color: "#7A4A1F" },
  { name: "Amber", color: "#D4AF37" },
  { name: "Misk", color: "#B9B9B9" },
  { name: "Vanilya", color: "#F5E6B3" },
  { name: "Sandal Ağacı", color: "#DDA15E" },
  { name: "Vetiver", color: "#606C38" },
  { name: "Paçuli", color: "#6B705C" },
  { name: "Deri", color: "#5A3E2B" },
  { name: "Tütsü", color: "#3A0F2A" },
  { name: "Benzoin", color: "#C97C5D" },
  { name: "Tonka", color: "#8D6E63" },
  { name: "Labdanum", color: "#A47148" },
  { name: "Meşe Yosunu", color: "#3D5A40" },
  { name: "Sedir", color: "#588157" },
  { name: "Tonka Fasulyesi", color: "#7F5539" },
];

const BOTTLE_OPTIONS: Array<{ id: BottleId; name: string; caption: string }> = [
  { id: "classic", name: "Classic", caption: "Zamansız form" },
  { id: "noir", name: "Noir", caption: "Modern keskin hatlar" },
  { id: "atelier", name: "Atelier", caption: "İnce boyun, zarif" },
  { id: "royal", name: "Royal", caption: "Geniş gövde, ağır duruş" },
];

/**
 * ✅ Şişe görselleri:
 * - 3 adet görsel var demiştin.
 * - Royal için şimdilik bottle-1 kullanıyorum (royal görseli gelince sadece path değiştirirsin).
 */
const BOTTLE_IMAGES: Record<BottleId, string> = {
  classic: "/bottles/bottle-1.png",
  noir: "/bottles/bottle-2.png",
  atelier: "/bottles/bottle-3.png",
  royal: "/bottles/bottle-1.png",
};

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function OlusturPage() {
  const router = useRouter();

  const [top, setTop] = useState(34);
  const [mid, setMid] = useState(33);
  const [base, setBase] = useState(33);

  const [baseType, setBaseType] = useState<"alkol" | "yag">("alkol");

  // ✅ Çoklu seçim
  const [selectedTopNotes, setSelectedTopNotes] = useState<string[]>([]);
  const [selectedMidNotes, setSelectedMidNotes] = useState<string[]>([]);
  const [selectedBaseNotes, setSelectedBaseNotes] = useState<string[]>([]);

  const [selectedBottle, setSelectedBottle] = useState<BottleId>("classic");

  // ✅ Açılışta şişe seçimi ekranı (gate)
  const [bottleGateOpen, setBottleGateOpen] = useState(true);

  // ✅ Hover/Fokus ile büyük preview (pencere)
  const [bottlePreview, setBottlePreview] = useState<BottleId | null>(null);

  // ✅ Müşteri parfüm ismi
  const [perfumeName, setPerfumeName] = useState("");

  // ✅ Sepete eklendi feedback
  const [addedPulse, setAddedPulse] = useState(false);

  // ✅ Gate açıkken arka sayfayı kilitle (scroll/focus davranışı düzgün)
  useEffect(() => {
    if (!bottleGateOpen) return;
    const prevOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [bottleGateOpen]);

  // ✅ Gate kapanınca preview'ı da kapat
  useEffect(() => {
    if (!bottleGateOpen) setBottlePreview(null);
  }, [bottleGateOpen]);

  const total = useMemo(() => top + mid + base, [top, mid, base]);

  const setRatio = (key: NoteKey, value: number) => {
    value = Math.max(0, Math.min(100, Math.round(value)));
    let t = top,
      m = mid,
      b = base;

    if (key === "top") t = value;
    if (key === "mid") m = value;
    if (key === "base") b = value;

    let sum = t + m + b;

    if (sum > 100) {
      const overflow = sum - 100;
      if (key === "top") {
        const takeMid = Math.min(m, overflow);
        m -= takeMid;
        const remaining = overflow - takeMid;
        b = Math.max(0, b - remaining);
      } else if (key === "mid") {
        const takeTop = Math.min(t, overflow);
        t -= takeTop;
        const remaining = overflow - takeTop;
        b = Math.max(0, b - remaining);
      } else {
        const takeTop = Math.min(t, overflow);
        t -= takeTop;
        const remaining = overflow - takeTop;
        m = Math.max(0, m - remaining);
      }
    }

    sum = t + m + b;

    if (sum < 100) {
      const deficit = 100 - sum;
      if (key !== "base") b += deficit;
      else if (key !== "mid") m += deficit;
      else t += deficit;
    }

    t = Math.max(0, Math.min(100, t));
    m = Math.max(0, Math.min(100, m));
    b = Math.max(0, Math.min(100, b));

    const finalSum = t + m + b;
    if (finalSum !== 100) {
      const diff = 100 - finalSum;
      b = Math.max(0, Math.min(100, b + diff));
    }

    setTop(t);
    setMid(m);
    setBase(b);
  };

  // ✅ Toggle çoklu seçim
  const toggleNote = (arr: string[], noteName: string) =>
    arr.includes(noteName) ? arr.filter((n) => n !== noteName) : [...arr, noteName];

  const onPickNote = (key: NoteKey, noteName: string) => {
    if (key === "top") setSelectedTopNotes((prev) => toggleNote(prev, noteName));
    if (key === "mid") setSelectedMidNotes((prev) => toggleNote(prev, noteName));
    if (key === "base") setSelectedBaseNotes((prev) => toggleNote(prev, noteName));
  };

  const canAddToCart =
    selectedTopNotes.length > 0 &&
    selectedMidNotes.length > 0 &&
    selectedBaseNotes.length > 0 &&
    total === 100;

  const getPrice = () => (baseType === "alkol" ? PRICE_ALKOL : PRICE_YAG);

  const addToCart = () => {
    if (!canAddToCart) return;

    const item: CartItem = {
      id: `item_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),

      topNote: selectedTopNotes.join(", "),
      midNote: selectedMidNotes.join(", "),
      baseNote: selectedBaseNotes.join(", "),

      topNotes: selectedTopNotes,
      midNotes: selectedMidNotes,
      baseNotes: selectedBaseNotes,

      perfumeName: perfumeName.trim(),

      ratios: { top, mid, base },
      baseType,
      price: getPrice(),
      bottleId: selectedBottle,
    };

    try {
      const raw = localStorage.getItem(CART_KEY);
      const current: CartItem[] = raw ? JSON.parse(raw) : [];
      current.push(item);
      localStorage.setItem(CART_KEY, JSON.stringify(current));
    } catch {}

    window.dispatchEvent(new Event("cart_updated"));

    setAddedPulse(true);
    window.setTimeout(() => setAddedPulse(false), 1400);

    void router;
  };

  // ✅ Vurgu rengi
  const firstTop = selectedTopNotes[0] || "";
  const firstMid = selectedMidNotes[0] || "";
  const firstBase = selectedBaseNotes[0] || "";

  const topAccent = TOP_NOTES.find((n) => n.name === firstTop)?.color || TOP_FALLBACK;
  const midAccent = MID_NOTES.find((n) => n.name === firstMid)?.color || MID_FALLBACK;
  const baseAccent = BASE_NOTES.find((n) => n.name === firstBase)?.color || BASE_FALLBACK;

  const bottleLabel = BOTTLE_OPTIONS.find((b) => b.id === selectedBottle)?.name || "Classic";

  const selectedTopText = selectedTopNotes.length ? selectedTopNotes.join(" + ") : "";
  const selectedMidText = selectedMidNotes.length ? selectedMidNotes.join(" + ") : "";
  const selectedBaseText = selectedBaseNotes.length ? selectedBaseNotes.join(" + ") : "";

  return (
    <main className="olustur-shell">
      {/* ✅ AÇILIŞ ŞİŞE SEÇİM EKRANI (TAM EKRAN - TAM GÖRÜNÜR) */}
      {bottleGateOpen && (
        <div className="gate" role="dialog" aria-modal="true" aria-label="Şişe Seçimi">
          <div className="gate-backdrop" aria-hidden />

          {/* ✅ Büyük şişe preview penceresi (hover/focus ile açılır) */}
          {bottlePreview ? (
            <div className="gatePreview" aria-hidden>
              <div className="gatePreviewBackdrop" />
              <div className="gatePreviewCard">
                <div className="gatePreviewInner">
                  <img
                    src={BOTTLE_IMAGES[bottlePreview]}
                    alt=""
                    className="gatePreviewImg"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="gate-card">
            <div className="gate-head">
              <div className="gate-kicker">ANKA • BOTTLE SELECTION</div>
              <div className="gate-title">Şişeni Seç</div>
              <div className="gate-sub">İmzanı oluşturmadan önce şişeni seç. Sonra notalara geç.</div>
            </div>

            <div className="gate-grid">
              {BOTTLE_OPTIONS.map((b) => {
                const active = b.id === selectedBottle;
                return (
                  <button
                    key={b.id}
                    className={`gate-item ${active ? "active" : ""}`}
                    onClick={() => setSelectedBottle(b.id)}
                    onMouseEnter={() => setBottlePreview(b.id)}
                    onMouseLeave={() => setBottlePreview((cur) => (cur === b.id ? null : cur))}
                    onFocus={() => setBottlePreview(b.id)}
                    onBlur={() => setBottlePreview((cur) => (cur === b.id ? null : cur))}
                  >
                    <div className="gate-photo" aria-hidden>
                      <img
                        src={BOTTLE_IMAGES[b.id]}
                        alt={b.name}
                        className="gate-bottle-img"
                        draggable={false}
                      />
                    </div>

                    <div className="gate-meta">
                      <div className="gate-name">{b.name}</div>
                      <div className="gate-cap">{b.caption}</div>
                    </div>

                    <div className="gate-mark">{active ? "✓" : "+"}</div>
                  </button>
                );
              })}
            </div>

            <div className="gate-actions">
              <button className="gate-primary" onClick={() => setBottleGateOpen(false)}>
                Devam Et <span style={{ opacity: 0.7 }}>→</span>
              </button>
              <div className="gate-hint">
                Seçtiğin şişe: <span className="gate-hint-strong">{bottleLabel}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="olustur-hero">
        <div className="hero-glow" aria-hidden />
        <div className="hero-inner">
          <div className="kicker">Anka Atelier • Personal Parfum</div>
          <h1 className="hero-title">Parfümünü Oluştur</h1>
          <p className="hero-sub">Notalarını seç, oranları ayarla. İmzanı oluştur.</p>

          <div className="hero-metrics">
            <div className="metric">
              <div className="metric-label">Toplam</div>
              <div className="metric-value">
                %{total} <span className={total === 100 ? "ok" : "warn"}>●</span>
              </div>
            </div>
            <div className="metric">
              <div className="metric-label">Seçilen Şişe</div>
              <div className="metric-value">{bottleLabel}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Fiyat</div>
              <div className="metric-value gold">{getPrice().toLocaleString("tr-TR")} ₺</div>
            </div>
          </div>
        </div>
      </header>

      <section className="olustur-grid">
        {/* SOL */}
        <div className="notes-panel">
          <div className="panel-head">
            <div className="panel-title">Nota Seçimi</div>
            <div className="panel-sub">Her gruptan birden fazla nota seçebilirsin.</div>
          </div>

          <div className="notes-3col">
            <NoteColumn
              title="Üst Nota"
              notes={TOP_NOTES}
              selected={selectedTopNotes}
              onPick={(note) => onPickNote("top", note)}
            />
            <NoteColumn
              title="Orta Nota"
              notes={MID_NOTES}
              selected={selectedMidNotes}
              onPick={(note) => onPickNote("mid", note)}
            />
            <NoteColumn
              title="Alt Nota"
              notes={BASE_NOTES}
              selected={selectedBaseNotes}
              onPick={(note) => onPickNote("base", note)}
            />
          </div>
        </div>

        {/* ORTA */}
        <div className="mix-stage">
          <div className="stage-card">
            <div className="stage-top">
              <div className="stage-title">Karışım</div>
              <div className="stage-badge">{canAddToCart ? "Hazır" : "Eksik"}</div>
            </div>

            <div className="mix-visual">
              <div className="mix-ring" aria-hidden />
              <div className="bottle-wrap">
                <BottleMockupMix
                  png={BOTTLE_PNG}
                  topPct={top}
                  midPct={mid}
                  basePct={base}
                  topAccent={topAccent}
                  midAccent={midAccent}
                  baseAccent={baseAccent}
                  baseType={baseType}
                />
              </div>

              <div className="mix-legend">
                <LegendLine label="Üst Nota" note={selectedTopText} pct={top} dot={topAccent} />
                <LegendLine label="Orta Nota" note={selectedMidText} pct={mid} dot={midAccent} />
                <LegendLine label="Alt Nota" note={selectedBaseText} pct={base} dot={baseAccent} />
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ */}
        <aside className="control-panel">
          <div className="panel-head">
            <div className="panel-title">Oranlar</div>
            <div className="panel-sub">Toplam %100’e kilitlenir.</div>
          </div>

          <div style={{ padding: "0 8px 6px" }}>
            <div className="mini-title" style={{ marginTop: 2 }}>
              Parfüm İsmi
            </div>
            <input
              value={perfumeName}
              onChange={(e) => setPerfumeName(e.target.value)}
              placeholder="Örn: Anka Signature No.1"
              style={{
                width: "100%",
                padding: "12px 12px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(0,0,0,0.22)",
                color: "rgba(255,255,255,0.92)",
                outline: "none",
              }}
            />
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.65 }}>
              (Opsiyonel) Sepette ve sipariş detayında görünecek.
            </div>
          </div>

          <Range
            label="Üst Nota"
            selectedNote={selectedTopText}
            value={top}
            onChange={(v) => setRatio("top", v)}
            max={100 - (mid + base)}
            accent={topAccent}
          />
          <Range
            label="Orta Nota"
            selectedNote={selectedMidText}
            value={mid}
            onChange={(v) => setRatio("mid", v)}
            max={100 - (top + base)}
            accent={midAccent}
          />
          <Range
            label="Alt Nota"
            selectedNote={selectedBaseText}
            value={base}
            onChange={(v) => setRatio("base", v)}
            max={100 - (top + mid)}
            accent={baseAccent}
          />

          <div className="divider" />

          <div>
            <div className="mini-title">Baz Türü</div>
            <div className="base-row">
              <BaseBlock active={baseType === "alkol"} onClick={() => setBaseType("alkol")}>
                Alkol Bazlı
              </BaseBlock>
              <BaseBlock active={baseType === "yag"} onClick={() => setBaseType("yag")}>
                Yağ Bazlı
              </BaseBlock>
            </div>

            <div className="price-row">
              <div className="price-label">Fiyat</div>
              <div className="price-val">{getPrice().toLocaleString("tr-TR")} ₺</div>
            </div>
          </div>

          <button onClick={addToCart} disabled={!canAddToCart} className="cta">
            Sepete Ekle
          </button>

          {!canAddToCart && (
            <div className="warnbox">
              Sepete eklemek için Üst/Orta/Alt notadan en az birer seçim yap ve toplamı %100 yap.
            </div>
          )}

          {canAddToCart && !addedPulse && <div className="okbox">Karışım hazır. Sepete ekleyebilirsin.</div>}

          {addedPulse && (
            <div
              className="okbox"
              style={{
                borderColor: "rgba(135, 255, 196, 0.34)",
                boxShadow: "0 18px 60px rgba(135, 255, 196, 0.08)",
              }}
            >
              ✓ Sepete eklendi
            </div>
          )}
        </aside>
      </section>

      {/* ANIM */}
      <style jsx>{`
        @keyframes mkDrift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-34px, -18px, 0);
          }
        }
        @keyframes mkShine {
          0% {
            transform: translateX(-75%) skewX(-14deg);
            opacity: 0.12;
          }
          40% {
            opacity: 0.26;
          }
          100% {
            transform: translateX(95%) skewX(-14deg);
            opacity: 0.12;
          }
        }
        @keyframes bubbleUp {
          0% {
            transform: translate3d(0, 16px, 0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, -160px, 0);
            opacity: 0;
          }
        }
        @keyframes gateIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.99);
            filter: blur(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes previewIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.985);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
      `}</style>

      {/* STYLES */}
      <style jsx>{`
        .olustur-shell {
          min-height: 100dvh;
          padding: 22px 34px 40px;
          color: rgba(255, 255, 255, 0.92);
          background: radial-gradient(1200px 600px at 15% 0%, rgba(212, 175, 55, 0.18), transparent 55%),
            radial-gradient(900px 520px at 85% 10%, rgba(157, 78, 221, 0.16), transparent 55%),
            radial-gradient(900px 600px at 50% 110%, rgba(0, 0, 0, 0.8), rgba(8, 4, 11, 1));
          overflow-x: hidden;
        }

        /* ✅ GATE */
        .gate {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          padding: 0;
          touch-action: pan-y;
        }
        .gate-backdrop {
          position: absolute;
          inset: 0;
          background: radial-gradient(1000px 520px at 20% 10%, rgba(212, 175, 55, 0.12), transparent 60%),
            radial-gradient(900px 520px at 85% 20%, rgba(157, 78, 221, 0.16), transparent 60%),
            rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(10px);
        }

        /* ✅ Büyük preview penceresi */
        .gatePreview {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: grid;
          place-items: center;
          pointer-events: none; /* ✅ hover bozulmasın */
        }
        .gatePreviewBackdrop {
          position: absolute;
          inset: 0;
          background: radial-gradient(700px 380px at 50% 45%, rgba(212, 175, 55, 0.14), transparent 60%),
            rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(3px);
        }
        .gatePreviewCard {
          position: relative;
          width: min(520px, calc(100vw - 40px));
          height: min(720px, calc(100dvh - 140px));
          border-radius: 28px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.28));
          box-shadow: 0 60px 180px rgba(0, 0, 0, 0.72);
          overflow: hidden;
          animation: previewIn 180ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
        }
        .gatePreviewInner {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 28px;
        }
        .gatePreviewInner::before {
          content: "";
          position: absolute;
          inset: -120px;
          background: radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.26), transparent 58%),
            radial-gradient(circle at 30% 75%, rgba(157, 78, 221, 0.12), transparent 62%),
            radial-gradient(circle at 70% 75%, rgba(255, 255, 255, 0.06), transparent 64%);
          filter: blur(18px);
          opacity: 0.9;
        }
        .gatePreviewImg {
          position: relative;
          width: 88%;
          height: 88%;
          object-fit: contain; /* ✅ her hat görünsün */
          filter: drop-shadow(0 28px 70px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 28px rgba(212, 175, 55, 0.26));
          transform: translateZ(0);
        }

        .gate-card {
          position: relative;
          width: min(980px, calc(100vw - 32px));
          max-height: calc(100dvh - 32px);
          overflow: auto;
          border-radius: 28px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.3));
          box-shadow: 0 50px 160px rgba(0, 0, 0, 0.72);
          animation: gateIn 520ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
          transform: translateY(-18vh);
        }
        .gate-head {
          padding: 18px 22px 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .gate-kicker {
          font-size: 12px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.85);
          opacity: 0.9;
        }
        .gate-title {
          margin: 10px 0 4px;
          font-size: 40px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: rgba(212, 175, 55, 0.95);
          text-shadow: 0 18px 60px rgba(0, 0, 0, 0.55);
        }
        .gate-sub {
          margin: 0;
          font-size: 13px;
          opacity: 0.8;
        }
        .gate-grid {
          padding: 14px 18px 10px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .gate-item {
          display: grid;
          grid-template-columns: 76px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 12px 12px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.26);
          cursor: pointer;
          transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
          text-align: left;
          color: rgba(255, 255, 255, 0.92);
          min-width: 0;
        }
        .gate-item:hover {
          transform: translateY(-1px);
          border-color: rgba(212, 175, 55, 0.26);
          box-shadow: 0 18px 50px rgba(212, 175, 55, 0.06);
        }
        .gate-item.active {
          border-color: rgba(212, 175, 55, 0.6);
          box-shadow: 0 24px 70px rgba(212, 175, 55, 0.1);
        }

        .gate-photo {
          width: 76px;
          height: 76px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12), transparent 60%);
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
        }
        .gate-bottle-img {
          width: 70%;
          height: auto;
          object-fit: contain;
          transition: transform 420ms cubic-bezier(0.2, 0.9, 0.2, 1),
            filter 420ms cubic-bezier(0.2, 0.9, 0.2, 1);
          filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.55));
          will-change: transform, filter;
          transform: translateZ(0);
        }
        .gate-item:hover .gate-bottle-img {
          transform: scale(1.12) translateY(-4px);
          filter: drop-shadow(0 18px 40px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 22px rgba(212, 175, 55, 0.45));
        }

        .gate-meta {
          display: grid;
          gap: 2px;
          min-width: 0;
        }
        .gate-name {
          font-size: 14px;
          color: rgba(212, 175, 55, 0.92);
          letter-spacing: 0.02em;
        }
        .gate-cap {
          font-size: 12px;
          opacity: 0.7;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .gate-mark {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.18);
          color: rgba(212, 175, 55, 0.92);
          font-weight: 800;
          flex: 0 0 auto;
        }
        .gate-actions {
          padding: 12px 18px 18px;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .gate-primary {
          padding: 12px 16px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.65);
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.98), rgba(212, 175, 55, 0.72));
          color: rgba(8, 4, 11, 0.98);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 160ms ease, filter 160ms ease;
          box-shadow: 0 24px 60px rgba(212, 175, 55, 0.12);
          white-space: nowrap;
        }
        .gate-primary:hover {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }
        .gate-primary:active {
          transform: translateY(0px) scale(0.99);
        }
        .gate-hint {
          font-size: 12px;
          opacity: 0.75;
          text-align: right;
          min-width: 0;
        }
        .gate-hint-strong {
          color: rgba(212, 175, 55, 0.95);
          font-weight: 800;
        }

        .olustur-hero {
          position: relative;
          max-width: 1500px;
          margin: 0 auto 22px;
          border-radius: 28px;
          border: 1px solid rgba(212, 175, 55, 0.22);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.2));
          overflow: hidden;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.55);
        }
        .hero-glow {
          position: absolute;
          inset: -2px;
          background: radial-gradient(800px 240px at 50% 0%, rgba(212, 175, 55, 0.22), transparent 60%),
            radial-gradient(700px 260px at 70% 30%, rgba(255, 255, 255, 0.08), transparent 62%),
            radial-gradient(800px 300px at 10% 30%, rgba(157, 78, 221, 0.12), transparent 62%);
          filter: blur(2px);
          opacity: 0.9;
          pointer-events: none;
        }
        .hero-inner {
          position: relative;
          padding: 26px 26px 22px;
          backdrop-filter: blur(12px);
        }
        .kicker {
          font-size: 12px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.85);
          opacity: 0.9;
        }
        .hero-title {
          margin: 10px 0 8px;
          font-size: 44px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: rgba(212, 175, 55, 0.95);
          text-shadow: 0 18px 60px rgba(0, 0, 0, 0.55);
        }
        .hero-sub {
          margin: 0;
          max-width: 920px;
          font-size: 14px;
          opacity: 0.82;
        }
        .hero-metrics {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .metric {
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.32);
          padding: 12px 14px;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
        }
        .metric-label {
          font-size: 12px;
          opacity: 0.65;
        }
        .metric-value {
          margin-top: 6px;
          font-size: 18px;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .metric-value .ok {
          color: rgba(135, 255, 196, 0.95);
          text-shadow: 0 0 16px rgba(135, 255, 196, 0.22);
        }
        .metric-value .warn {
          color: rgba(255, 184, 108, 0.95);
          text-shadow: 0 0 16px rgba(255, 184, 108, 0.18);
        }
        .gold {
          color: rgba(212, 175, 55, 0.95);
        }

        .olustur-grid {
          max-width: 1500px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.25fr 0.95fr 0.8fr;
          gap: 18px;
          align-items: start;
        }
        .notes-panel,
        .control-panel,
        .stage-card {
          border-radius: 26px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          background: rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(14px);
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.5);
        }
        .notes-panel {
          padding: 18px;
        }
        .control-panel {
          padding: 18px;
          position: sticky;
          top: 18px;
        }
        .panel-head {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 8px 14px;
        }
        .panel-title {
          font-size: 15px;
          letter-spacing: 0.02em;
          color: rgba(212, 175, 55, 0.92);
        }
        .panel-sub {
          font-size: 12px;
          opacity: 0.7;
        }
        .notes-3col {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          padding: 0 6px 6px;
        }
        .mix-stage {
          position: sticky;
          top: 18px;
          min-width: 0;
        }
        .stage-card {
          padding: 18px;
          overflow: hidden;
        }
        .stage-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 6px 10px;
        }
        .stage-title {
          font-size: 15px;
          color: rgba(212, 175, 55, 0.92);
          letter-spacing: 0.02em;
        }
        .stage-badge {
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.28);
          opacity: 0.9;
        }
        .mix-visual {
          position: relative;
          padding: 14px 12px 10px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.25));
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }
        .mix-ring {
          position: absolute;
          inset: -100px;
          background: radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.22), transparent 58%),
            radial-gradient(circle at 30% 70%, rgba(157, 78, 221, 0.14), transparent 60%),
            radial-gradient(circle at 70% 75%, rgba(255, 255, 255, 0.06), transparent 62%);
          filter: blur(16px);
          opacity: 0.9;
          pointer-events: none;
        }
        .bottle-wrap {
          position: relative;
          display: grid;
          place-items: center;
          padding: 6px 6px 2px;
          overflow: hidden;
          max-width: 100%;
        }
        .mix-legend {
          position: relative;
          margin-top: 12px;
          padding: 10px 10px 8px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.28);
          display: grid;
          gap: 8px;
        }
        .divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 16px 0;
        }
        .mini-title {
          font-size: 13px;
          color: rgba(212, 175, 55, 0.9);
          margin-bottom: 10px;
        }
        .base-row {
          display: flex;
          gap: 12px;
        }
        .price-row {
          margin-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 10px 12px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.24);
        }
        .price-label {
          font-size: 12px;
          opacity: 0.7;
        }
        .price-val {
          font-size: 18px;
          color: rgba(212, 175, 55, 0.95);
          letter-spacing: -0.01em;
        }
        .cta {
          margin-top: 14px;
          width: 100%;
          padding: 14px 16px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.65);
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.98), rgba(212, 175, 55, 0.72));
          color: rgba(8, 4, 11, 0.98);
          font-size: 15px;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 160ms ease, filter 160ms ease, opacity 160ms ease;
          box-shadow: 0 24px 60px rgba(212, 175, 55, 0.12);
        }
        .cta:hover {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }
        .cta:active {
          transform: translateY(0px) scale(0.99);
        }
        .cta:disabled {
          cursor: not-allowed;
          opacity: 0.45;
          background: rgba(0, 0, 0, 0.18);
          color: rgba(212, 175, 55, 0.65);
          box-shadow: none;
        }
        .warnbox,
        .okbox {
          margin-top: 10px;
          font-size: 12px;
          padding: 10px 12px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.24);
          opacity: 0.85;
        }
        .okbox {
          border-color: rgba(135, 255, 196, 0.22);
        }

        @media (max-width: 1200px) {
          .olustur-grid {
            grid-template-columns: 1fr;
          }
          .mix-stage,
          .control-panel {
            position: relative;
            top: auto;
          }
          .gate-card {
            transform: translateY(-2vh);
          }
          .gatePreviewCard {
            height: min(640px, calc(100dvh - 180px));
          }
        }
        @media (max-width: 720px) {
          .olustur-shell {
            padding: 18px 16px 30px;
          }
          .hero-title {
            font-size: 34px;
          }
          .notes-3col {
            grid-template-columns: 1fr;
          }
          .gate-grid {
            grid-template-columns: 1fr;
          }
          .gate-title {
            font-size: 32px;
          }
          .gatePreviewCard {
            width: min(520px, calc(100vw - 26px));
            height: min(600px, calc(100dvh - 200px));
          }
        }
      `}</style>
    </main>
  );
}

/* ===========================
✅ BottleMockupMix
=========================== */
function BottleMockupMix({
  png,
  topPct,
  midPct,
  basePct,
  topAccent,
  midAccent,
  baseAccent,
  baseType,
}: {
  png: string;
  topPct: number;
  midPct: number;
  basePct: number;
  topAccent: string;
  midAccent: string;
  baseAccent: string;
  baseType: "alkol" | "yag";
}) {
  const speed = baseType === "alkol" ? 6.2 : 9.6;
  const bubbleOpacity = baseType === "alkol" ? 0.22 : 0.14;
  const gloss = baseType === "alkol" ? 0.34 : 0.24;

  const INSET = {
    left: "17%",
    right: "17%",
    top: "28%",
    bottom: "15%",
    radius: "18px",
  };

  return (
    <div className="mk-wrap">
      <div
        className="mk-fill"
        style={
          {
            ["--top" as any]: `${topPct}%`,
            ["--mid" as any]: `${midPct}%`,
            ["--base" as any]: `${basePct}%`,
            ["--cTop" as any]: topAccent,
            ["--cMid" as any]: midAccent,
            ["--cBase" as any]: baseAccent,
            ["--spd" as any]: `${speed}s`,
            ["--bop" as any]: bubbleOpacity,
            ["--gloss" as any]: gloss,
            ["--inL" as any]: INSET.left,
            ["--inR" as any]: INSET.right,
            ["--inT" as any]: INSET.top,
            ["--inB" as any]: INSET.bottom,
            ["--inRad" as any]: INSET.radius,
          } as React.CSSProperties
        }
        aria-hidden
      >
        <div className="mk-innerClip">
          <div className="mk-layer mk-base" />
          <div className="mk-layer mk-mid" />
          <div className="mk-layer mk-top" />
          <div className="mk-liquidFx" />
          <div className="mk-spec" />
          <span className="mk-b mk-b1" />
          <span className="mk-b mk-b2" />
          <span className="mk-b mk-b3" />
          <span className="mk-b mk-b4" />
        </div>
      </div>

      <img src={png} alt="Parfüm şişesi" className="mk-overlay" draggable={false} />

      <style jsx>{`
        .mk-wrap {
          position: relative;
          width: min(360px, 100%);
          aspect-ratio: 1 / 1.35;
          display: grid;
          place-items: center;
          overflow: hidden;
          filter: drop-shadow(0 70px 140px rgba(0, 0, 0, 0.72));
        }
        .mk-fill {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .mk-innerClip {
          position: absolute;
          left: var(--inL);
          right: var(--inR);
          top: var(--inT);
          bottom: var(--inB);
          border-radius: var(--inRad);
          overflow: hidden;
          background: radial-gradient(100% 120% at 50% 20%, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.22)),
            rgba(0, 0, 0, 0.18);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 -40px 90px rgba(0, 0, 0, 0.35);
        }
        .mk-layer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 16px;
          overflow: hidden;
          transform: translateZ(0);
          will-change: height, bottom;
          filter: saturate(1.12) contrast(1.02);
        }
        .mk-base {
          height: var(--base);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent 35%),
            linear-gradient(180deg, var(--cBase), rgba(0, 0, 0, 0.36));
          transition: height 520ms cubic-bezier(0.2, 0.9, 0.2, 1);
        }
        .mk-mid {
          height: var(--mid);
          bottom: var(--base);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.11), transparent 35%),
            linear-gradient(180deg, var(--cMid), rgba(0, 0, 0, 0.3));
          transition: height 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
            bottom 520ms cubic-bezier(0.2, 0.9, 0.2, 1);
        }
        .mk-top {
          height: var(--top);
          bottom: calc(var(--base) + var(--mid));
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent 35%),
            linear-gradient(180deg, var(--cTop), rgba(0, 0, 0, 0.26));
          transition: height 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
            bottom 520ms cubic-bezier(0.2, 0.9, 0.2, 1);
        }
        .mk-liquidFx {
          position: absolute;
          inset: -40px;
          background: radial-gradient(circle at 28% 26%, rgba(255, 255, 255, 0.22), transparent 58%),
            radial-gradient(circle at 76% 70%, rgba(0, 0, 0, 0.16), transparent 62%),
            radial-gradient(circle at 40% 75%, rgba(255, 255, 255, 0.12), transparent 58%),
            radial-gradient(circle at 60% 45%, rgba(255, 255, 255, 0.1), transparent 62%);
          mix-blend-mode: overlay;
          opacity: 0.7;
          animation: mkDrift var(--spd) linear infinite;
          pointer-events: none;
        }
        .mk-spec {
          position: absolute;
          inset: -40px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, calc(var(--gloss) + 0.08)),
            rgba(255, 255, 255, calc(var(--gloss) - 0.14)),
            rgba(255, 255, 255, 0)
          );
          opacity: 0.38;
          transform: skewX(-14deg);
          animation: mkShine 4.2s ease-in-out infinite;
          pointer-events: none;
        }
        .mk-b {
          position: absolute;
          width: 3.6px;
          height: 3.6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          opacity: var(--bop);
          filter: blur(0.15px);
          animation: bubbleUp 4.8s ease-in-out infinite;
          pointer-events: none;
        }
        .mk-b1 {
          left: 18%;
          bottom: 10%;
          animation-delay: 0s;
        }
        .mk-b2 {
          left: 62%;
          bottom: 12%;
          width: 3px;
          height: 3px;
          animation-delay: 0.9s;
        }
        .mk-b3 {
          left: 44%;
          bottom: 14%;
          width: 2.8px;
          height: 2.8px;
          animation-delay: 1.8s;
        }
        .mk-b4 {
          left: 30%;
          bottom: 9%;
          width: 2.4px;
          height: 2.4px;
          animation-delay: 2.7s;
        }
        .mk-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          z-index: 3;
          filter: drop-shadow(0 60px 120px rgba(0, 0, 0, 0.6));
        }
      `}</style>
    </div>
  );
}

/* =========================== UI COMPONENTS =========================== */

function NoteColumn({
  title,
  notes,
  selected,
  onPick,
}: {
  title: string;
  notes: NoteOption[];
  selected: string[];
  onPick: (note: string) => void;
}) {
  return (
    <div>
      <div
        style={{
          textAlign: "center",
          color: "rgba(212,175,55,0.92)",
          marginBottom: 10,
          fontSize: 13,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          opacity: 0.95,
        }}
      >
        {title}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {notes.map((opt) => {
          const isSelected = selected.includes(opt.name);
          const bg = isSelected ? hexToRgba(opt.color, 0.26) : hexToRgba(opt.color, 0.14);
          const border = isSelected ? hexToRgba(opt.color, 0.92) : hexToRgba(opt.color, 0.42);

          return (
            <button
              key={opt.name}
              onClick={() => onPick(opt.name)}
              style={{
                width: "100%",
                textAlign: "left",
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: "10px 12px",
                background: bg,
                fontSize: 13,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.92)",
                boxShadow: isSelected ? `0 18px 40px ${hexToRgba(opt.color, 0.12)}` : "none",
                transition: "transform 160ms ease, box-shadow 160ms ease, background 160ms ease",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  aria-hidden
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: opt.color,
                    boxShadow: "0 0 0 3px rgba(0,0,0,0.22)",
                  }}
                />
                <span>{opt.name}</span>
              </span>
              <span style={{ color: opt.color, fontWeight: 700 }}>{isSelected ? "✓" : "+"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Range({
  label,
  selectedNote,
  value,
  onChange,
  max,
  accent,
}: {
  label: string;
  selectedNote: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
  accent: string;
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 13, opacity: 0.92 }}>
          {label} <span style={{ opacity: 0.65 }}>— {selectedNote ? selectedNote : "Seçilmedi"}</span>
        </span>
        <span style={{ color: "rgba(212,175,55,0.95)", fontSize: 13 }}>%{value}</span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: accent, marginTop: 8 }}
      />

      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
        Max: <span style={{ color: "rgba(212,175,55,0.95)" }}>%{Math.max(0, max)}</span>
      </div>
    </div>
  );
}

function BaseBlock({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 16,
        border: `1px solid ${active ? "rgba(212,175,55,0.7)" : "rgba(255,255,255,0.10)"}`,
        background: active
          ? "linear-gradient(180deg, rgba(212,175,55,0.95), rgba(212,175,55,0.72))"
          : "rgba(0, 0, 0, 0.22)",
        color: active ? "rgba(8,4,11,0.95)" : "rgba(212,175,55,0.92)",
        cursor: "pointer",
        transition: "transform 160ms ease, filter 160ms ease",
      }}
    >
      {children}
    </button>
  );
}

function LegendLine({
  label,
  note,
  pct,
  dot,
}: {
  label: string;
  note: string;
  pct: number;
  dot: string;
}) {
  const chosen = note ? note : "Seçilmedi";

  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span
          aria-hidden
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: dot,
            boxShadow: "0 0 0 3px rgba(0,0,0,0.22)",
            flex: "0 0 auto",
          }}
        />
        <div style={{ fontSize: 12, opacity: 0.75, whiteSpace: "nowrap" }}>{label}</div>
        <div
          style={{
            fontSize: 12,
            opacity: 0.9,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={chosen}
        >
          {chosen}
        </div>
      </div>

      <div style={{ fontSize: 12, color: "rgba(212,175,55,0.92)" }}>%{pct}</div>
    </div>
  );
}
