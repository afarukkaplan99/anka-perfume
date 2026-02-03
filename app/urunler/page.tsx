"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CART_KEY = "anka_cart";

type Product = {
  id: string;
  title: string;
  desc: string;
  price: number;
  badge?: string;
  scent?: string;
  tags: string[];
  image?: string;
};

type CartGiftItem = {
  id: string;
  createdAt: number;
  kind: "gift";
  title: string;
  essences: string[];
  bottle?: { name: string };
  price: number;
};

type CartPersonalItem = {
  id: string;
  createdAt: number;
  kind?: "personal";
  topNote: string;
  midNote: string;
  baseNote: string;
  ratios: { top: number; mid: number; base: number };
  baseType: "alkol" | "yag";
  price: number;
  bottleId?: string;
};

type CartItem = CartGiftItem | CartPersonalItem;

function safeReadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function safeWriteCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {}
}
function formatTRY(n: number) {
  return n.toLocaleString("tr-TR") + " ₺";
}

const PRODUCTS: Product[] = [
  {
    id: "signature-01",
    title: "La'morca",
    desc: "Bergamot • İris • Amber — pürüzsüz ve rafine bir imza.",
    price: 8500,
    badge: "Bestseller",
    scent: "Fresh / Powdery",
    tags: ["fresh", "powdery", "signature"],
    image: "/products/product-1.png",
  },
  {
    id: "noir-02",
    title: "Northern Breeze",
    desc: "Pembe Biber • Tütsü • Oud — güçlü, karizmatik, gece gibi.",
    price: 9999,
    badge: "Limited",
    scent: "Dark / Woody",
    tags: ["woody", "dark", "oud"],
    image: "/products/product-2.png",
  },
  {
    id: "atelier-03",
    title: "Night Fog",
    desc: "Neroli • Yasemin • Vanilya — ipek gibi, lüks bir çiçek dokusu.",
    price: 10999,
    badge: "Yeni",
    scent: "Floral / Creamy",
    tags: ["floral", "creamy", "soft"],
    image: "/products/product-3.png",
  },
  {
    id: "royal-04",
    title: "La ımpératrice",
    desc: "Safran • Bal • Sedir — altın tonlu, ağır ve asil.",
    price: 24999,
    scent: "Amber / Warm",
    tags: ["amber", "warm", "sweet"],
    image: "/products/product-4.png",
  },
];

const FILTERS = [
  { key: "all", label: "Tümü" },
  { key: "fresh", label: "Fresh" },
  { key: "floral", label: "Floral" },
  { key: "woody", label: "Woody" },
  { key: "amber", label: "Amber" },
  { key: "oud", label: "Oud" },
  { key: "signature", label: "Signature" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function MagazaPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<"featured" | "priceAsc" | "priceDesc">("featured");
  const [cartCount, setCartCount] = useState(0);

  // ✅ “Sepete eklendi” feedback: ürün bazlı toast
  const [addedId, setAddedId] = useState<string | null>(null);
  const [addedPulse, setAddedPulse] = useState(false);

  useEffect(() => {
    const sync = () => setCartCount(safeReadCart().length);
    sync();
    window.addEventListener("cart_updated", sync);
    return () => window.removeEventListener("cart_updated", sync);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let arr = PRODUCTS.filter((p) => {
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        (p.scent || "").toLowerCase().includes(q);

      const matchFilter = activeFilter === "all" ? true : p.tags.includes(activeFilter);

      return matchQuery && matchFilter;
    });

    if (sort === "priceAsc") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") arr = [...arr].sort((a, b) => b.price - a.price);

    return arr;
  }, [query, activeFilter, sort]);

  const addGiftToCart = (p: Product) => {
    const item: CartGiftItem = {
      id: `gift_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      kind: "gift",
      title: p.title,
      essences: [],
      bottle: { name: "Sistem Seçimi" },
      price: p.price,
    };

    const current = safeReadCart();
    current.push(item);
    safeWriteCart(current);
    window.dispatchEvent(new Event("cart_updated"));

    // ✅ Feedback
    setAddedId(p.id);
    setAddedPulse(true);
    window.setTimeout(() => setAddedPulse(false), 900);
    window.setTimeout(() => setAddedId((id) => (id === p.id ? null : id)), 1600);
  };

  return (
    <main className="shopShell">
      <header className="shopHero">
        <div className="heroGlow" aria-hidden />
        <div className="heroInner">
          <div className="kicker">Anka • Maison Collection</div>

          <div className="heroTopRow">
            <div style={{ minWidth: 0 }}>
              <h1 className="title">Mağaza</h1>
              <p className="sub">Hazır koleksiyonlar — sessiz lüks, net kalite.</p>
            </div>

            <Link href="/sepet" legacyBehavior passHref>
              <a className="cartChip" aria-label="Sepete git">
                <span className="dot" aria-hidden />
                Sepet <b>{cartCount}</b>
              </a>
            </Link>
          </div>

          <div className="controls">
            <div className="searchWrap">
              <span className="searchIcon" aria-hidden>
                ⌕
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara: örn. oud, amber, iris..."
                className="search"
              />
            </div>

            <div className="segWrap" role="tablist" aria-label="Filtreler">
              {FILTERS.map((f) => {
                const active = f.key === activeFilter;
                return (
                  <button
                    key={f.key}
                    role="tab"
                    aria-selected={active}
                    className={`seg ${active ? "active" : ""}`}
                    onClick={() => setActiveFilter(f.key)}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="sortWrap">
              <select
                className="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                aria-label="Sıralama"
              >
                <option value="featured">Öne Çıkanlar</option>
                <option value="priceAsc">Fiyat (Artan)</option>
                <option value="priceDesc">Fiyat (Azalan)</option>
              </select>
            </div>
          </div>

          <div className="miniLine">
            <div className="miniPill">Ücretsiz Kargo</div>
            <div className="miniPill">Premium Ambalaj</div>
            <div className="miniPill">Güvenli Ödeme</div>
          </div>
        </div>
      </header>

      <section className="grid">
        {filtered.length === 0 ? (
          <div className="empty">
            Aradığın ürün bulunamadı. Filtreyi değiştir veya aramayı sadeleştir.
          </div>
        ) : (
          filtered.map((p) => {
            const isAdded = addedId === p.id;
            return (
              <article key={p.id} className={`card ${isAdded ? "added" : ""}`}>
                <div className="media">
                  {p.badge && <div className="badge">{p.badge}</div>}

                  {p.image ? (
                    <div className="imgWrap">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 900px) 100vw, 25vw"
                        style={{ objectFit: "contain" }}
                        priority={false}
                      />
                    </div>
                  ) : (
                    <div className="imgPh" aria-hidden>
                      <div className="phGlow" />
                      <div className="phText">PRODUCT</div>
                    </div>
                  )}

                  <div className="shine" aria-hidden />

                  {/* ✅ Sepete eklendi pill */}
                  <div className={`addedPill ${isAdded ? "show" : ""}`} aria-live="polite">
                    ✓ Sepete eklendi
                  </div>
                </div>

                <div className="body">
                  <div className="row">
                    <h3 className="pTitle">{p.title}</h3>
                    <div className="price">{formatTRY(p.price)}</div>
                  </div>

                  <div className="desc">{p.desc}</div>
                  <div className="meta">
                    <span className="metaDot" aria-hidden />
                    {p.scent || "Signature Profile"}
                  </div>

                  <div className="actions" style={{ gridTemplateColumns: "1fr" }}>
                    <button className={`btnGold ${isAdded ? "pulse" : ""}`} onClick={() => addGiftToCart(p)}>
                      {isAdded ? "Eklendi" : "Sepete Ekle"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* ✅ Sağ altta global mini toast */}
      <div className={`toast ${addedId ? "show" : ""} ${addedPulse ? "pulse" : ""}`} aria-live="polite">
        ✓ Sepete eklendi
      </div>

      <section className="ctaStrip">
        <div className="ctaInner">
          <div>
            <div className="ctaTitle">Kendi imzanı yaratmak ister misin?</div>
            <div className="ctaSub">Notaları seç, oranı ayarla, şişede gerçek dolum hissi.</div>
          </div>

          <Link href="/olustur" legacyBehavior passHref>
            <a className="ctaBtn">Parfümünü Oluştur →</a>
          </Link>
        </div>
      </section>

      <style jsx>{`
        .shopShell {
          min-height: 100dvh;
          padding: 22px 34px 56px;
          color: rgba(255, 255, 255, 0.92);
          background: radial-gradient(1200px 600px at 15% 0%, rgba(212, 175, 55, 0.18), transparent 55%),
            radial-gradient(900px 520px at 85% 10%, rgba(157, 78, 221, 0.16), transparent 55%),
            radial-gradient(900px 600px at 50% 110%, rgba(0, 0, 0, 0.8), rgba(8, 4, 11, 1));
          overflow-x: hidden;
        }

        .shopHero {
          position: relative;
          max-width: 1500px;
          margin: 0 auto 18px;
          border-radius: 30px;
          border: 1px solid rgba(212, 175, 55, 0.22);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.2));
          overflow: hidden;
          box-shadow: 0 44px 140px rgba(0, 0, 0, 0.62);
        }
        .heroGlow {
          position: absolute;
          inset: -2px;
          background: radial-gradient(900px 260px at 50% 0%, rgba(212, 175, 55, 0.24), transparent 60%),
            radial-gradient(700px 260px at 70% 30%, rgba(255, 255, 255, 0.08), transparent 62%),
            radial-gradient(800px 300px at 10% 30%, rgba(157, 78, 221, 0.12), transparent 62%);
          filter: blur(2px);
          opacity: 0.95;
          pointer-events: none;
        }
        .heroInner {
          position: relative;
          padding: 26px 26px 18px;
          backdrop-filter: blur(12px);
        }
        .kicker {
          font-size: 12px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.88);
          opacity: 0.92;
        }
        .heroTopRow {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
        }
        .title {
          margin: 0;
          font-size: 46px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: rgba(212, 175, 55, 0.98);
          text-shadow: 0 18px 70px rgba(0, 0, 0, 0.6);
        }
        .sub {
          margin: 10px 0 0;
          max-width: 900px;
          font-size: 14px;
          opacity: 0.84;
          line-height: 1.7;
        }

        .cartChip {
          flex: 0 0 auto;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.25);
          padding: 10px 14px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(10px);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(212, 175, 55, 0.95);
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.22);
        }
        .cartChip b {
          color: rgba(212, 175, 55, 0.95);
        }

        .controls {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 12px;
          align-items: center;
        }
        .searchWrap {
          position: relative;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.22);
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .searchWrap:before {
          content: "";
          position: absolute;
          inset: -2px;
          background: radial-gradient(560px 160px at 20% -10%, rgba(212, 175, 55, 0.16), transparent 55%);
          opacity: 0.85;
          pointer-events: none;
        }
        .searchIcon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.7;
          color: rgba(212, 175, 55, 0.95);
          font-weight: 900;
          z-index: 1;
        }
        .search {
          width: 100%;
          padding: 12px 14px 12px 34px;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.92);
          background: transparent;
          font-size: 13px;
          position: relative;
          z-index: 1;
        }

        .segWrap {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .seg {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.18);
          color: rgba(255, 255, 255, 0.9);
          padding: 10px 12px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 12px;
          opacity: 0.88;
          transition: transform 140ms ease, border-color 160ms ease, opacity 160ms ease, background 160ms ease;
          white-space: nowrap;
        }
        .seg:hover {
          opacity: 1;
          border-color: rgba(212, 175, 55, 0.28);
          transform: translateY(-1px);
        }
        .seg.active {
          border-color: rgba(212, 175, 55, 0.78);
          background: rgba(212, 175, 55, 0.14);
          color: rgba(212, 175, 55, 0.98);
          opacity: 1;
        }

        .sortWrap {
          display: flex;
          justify-content: flex-end;
        }
        .sort {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.22);
          color: rgba(255, 255, 255, 0.92);
          padding: 12px 12px;
          border-radius: 14px;
          outline: none;
          font-size: 12px;
          min-width: 180px;
        }

        .miniLine {
          margin-top: 12px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .miniPill {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.18);
          border-radius: 999px;
          padding: 8px 10px;
          font-size: 12px;
          opacity: 0.86;
        }

        .grid {
          max-width: 1500px;
          margin: 16px auto 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .empty {
          max-width: 1500px;
          margin: 12px auto 0;
          padding: 18px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.22);
          opacity: 0.85;
        }

        .card {
          border-radius: 28px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          background: rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(14px);
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          display: grid;
          grid-template-rows: auto 1fr;
          min-width: 0;
          transform: translateZ(0);
          transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
        }
        .card:hover {
          transform: translateY(-2px);
          border-color: rgba(212, 175, 55, 0.26);
          box-shadow: 0 60px 140px rgba(0, 0, 0, 0.62);
        }
        .card.added {
          border-color: rgba(135, 255, 196, 0.22);
        }

        .media {
          position: relative;
          height: 190px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.28));
        }
        .media:after {
          content: "";
          position: absolute;
          inset: -2px;
          background: radial-gradient(600px 220px at 20% 0%, rgba(212, 175, 55, 0.1), transparent 55%);
          opacity: 0.85;
          pointer-events: none;
        }
        .badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 4;
          font-size: 12px;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.38);
          background: rgba(0, 0, 0, 0.28);
          color: rgba(212, 175, 55, 0.98);
          backdrop-filter: blur(8px);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
        }
        .imgWrap {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .imgPh {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          position: relative;
          z-index: 1;
        }
        .phGlow {
          position: absolute;
          inset: -40px;
          background: radial-gradient(circle at 35% 25%, rgba(212, 175, 55, 0.18), transparent 58%),
            radial-gradient(circle at 70% 75%, rgba(157, 78, 221, 0.14), transparent 60%),
            radial-gradient(circle at 50% 110%, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
          filter: blur(16px);
          opacity: 0.95;
        }
        .phText {
          position: relative;
          font-size: 12px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.85);
          opacity: 0.9;
        }
        .shine {
          position: absolute;
          inset: -60px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
          transform: skewX(-14deg) translateX(-70%);
          animation: shine 4.6s ease-in-out infinite;
          pointer-events: none;
          opacity: 0.55;
          z-index: 2;
        }

        .addedPill {
          position: absolute;
          right: 12px;
          bottom: 12px;
          z-index: 5;
          padding: 8px 10px;
          border-radius: 999px;
          border: 1px solid rgba(135, 255, 196, 0.28);
          background: rgba(0, 0, 0, 0.35);
          color: rgba(135, 255, 196, 0.95);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2px;
          backdrop-filter: blur(10px);
          transform: translateY(6px);
          opacity: 0;
          transition: opacity 160ms ease, transform 160ms ease;
        }
        .addedPill.show {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes shine {
          0% {
            transform: skewX(-14deg) translateX(-70%);
            opacity: 0.08;
          }
          45% {
            opacity: 0.18;
          }
          100% {
            transform: skewX(-14deg) translateX(90%);
            opacity: 0.08;
          }
        }

        .body {
          padding: 14px 14px 16px;
          display: grid;
          gap: 10px;
          min-width: 0;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 10px;
          min-width: 0;
        }
        .pTitle {
          margin: 0;
          font-size: 16px;
          color: rgba(212, 175, 55, 0.98);
          letter-spacing: 0.2px;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .price {
          flex: 0 0 auto;
          font-weight: 900;
          letter-spacing: -0.01em;
          color: rgba(255, 255, 255, 0.92);
        }
        .desc {
          font-size: 13px;
          opacity: 0.84;
          line-height: 1.65;
        }
        .meta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          opacity: 0.78;
        }
        .metaDot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(212, 175, 55, 0.95);
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.22);
        }

        .actions {
          margin-top: 6px;
          display: grid;
          gap: 10px;
        }

        .btnGold {
          padding: 12px 12px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.75);
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.98), rgba(212, 175, 55, 0.72));
          color: rgba(8, 4, 11, 0.98);
          cursor: pointer;
          transition: transform 140ms ease, filter 160ms ease, opacity 160ms ease;
          box-shadow: 0 24px 60px rgba(212, 175, 55, 0.14);
          font-weight: 900;
          letter-spacing: 0.2px;
        }
        .btnGold:hover {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }
        .btnGold:active {
          transform: translateY(0px) scale(0.99);
        }
        .btnGold.pulse {
          animation: pulseOk 520ms ease-out 1;
        }
        @keyframes pulseOk {
          0% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }

        .ctaStrip {
          max-width: 1500px;
          margin: 16px auto 0;
          border-radius: 26px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(14px);
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }
        .ctaInner {
          padding: 18px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .ctaTitle {
          color: rgba(212, 175, 55, 0.98);
          font-weight: 900;
          letter-spacing: 0.2px;
        }
        .ctaSub {
          margin-top: 4px;
          font-size: 13px;
          opacity: 0.8;
        }
        .ctaBtn {
          flex: 0 0 auto;
          text-decoration: none;
          padding: 12px 14px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.75);
          background: rgba(212, 175, 55, 0.12);
          color: rgba(212, 175, 55, 0.98);
          font-weight: 900;
          transition: transform 140ms ease, border-color 160ms ease, filter 160ms ease;
        }
        .ctaBtn:hover {
          border-color: rgba(212, 175, 55, 0.98);
          transform: translateY(-1px);
          filter: brightness(1.05);
        }

        /* ✅ Global toast */
        .toast {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 80;
          padding: 12px 14px;
          border-radius: 999px;
          border: 1px solid rgba(135, 255, 196, 0.28);
          background: rgba(0, 0, 0, 0.45);
          color: rgba(135, 255, 196, 0.95);
          font-weight: 900;
          letter-spacing: 0.2px;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 160ms ease, transform 160ms ease;
          pointer-events: none;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
        .toast.pulse {
          animation: toastPulse 520ms ease-out 1;
        }
        @keyframes toastPulse {
          0% {
            transform: translateY(0) scale(1);
          }
          45% {
            transform: translateY(0) scale(1.02);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 1200px) {
          .controls {
            grid-template-columns: 1fr;
          }
          .segWrap {
            justify-content: flex-start;
          }
          .sortWrap {
            justify-content: flex-start;
          }
          .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 720px) {
          .shopShell {
            padding: 18px 16px 34px;
          }
          .title {
            font-size: 34px;
          }
          .grid {
            grid-template-columns: 1fr;
          }
          .ctaInner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
