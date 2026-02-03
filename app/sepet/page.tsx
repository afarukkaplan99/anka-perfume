"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type CartItem =
  | {
      kind?: "custom";
      id: string;
      createdAt: number;

      // Parfüm ismi desteği (opsiyonel)
      name?: string;
      perfumeName?: string;

      topNote: string;
      midNote: string;
      baseNote: string;
      ratios: { top: number; mid: number; base: number };
      baseType: "alkol" | "yag";
      price: number;
    }
  | {
      kind?: "gift";
      id: string;
      createdAt: number;
      tier: "standard" | "premium";
      title?: string;
      essences: string[];
      bottle?: { id: string; name: string; image?: string };
      price: number;
    };

const CART_KEY = "anka_cart";

function emitCartUpdated() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("cart_updated"));
}

export default function SepetPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  const totalPrice = useMemo(
    () => items.reduce((acc, it: any) => acc + (it?.price || 0), 0),
    [items]
  );

  const removeItem = (id: string) => {
    const next = items.filter((x: any) => x.id !== id);
    setItems(next);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(next));
    } catch {}
    emitCartUpdated();
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify([]));
    } catch {}
    emitCartUpdated();
  };

  const formatTL = (v: number) => `${v.toLocaleString("tr-TR")} ₺`;

  return (
    <main
      style={{
        minHeight: "100dvh",
        padding: "120px 24px",
        background: "radial-gradient(1200px 600px at top, #2a0f3f, #09040c)",
        color: "white",
        overflowX: "hidden",
      }}
    >
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 26,
          }}
        >
          <div>
            <h1 style={{ color: "#d4af37", fontSize: 44, margin: 0 }}>Sepet</h1>
            <div style={{ marginTop: 10, opacity: 0.78 }}>
              Seçtiğin ürünleri burada kontrol edebilirsin.
            </div>
          </div>

          <Link
            href="/magaza"
            style={{
              color: "#d4af37",
              textDecoration: "none",
              border: "1px solid rgba(212,175,55,0.35)",
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.28)",
              backdropFilter: "blur(10px)",
            }}
          >
            ← Mağaza’ya dön
          </Link>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              border: "1px solid rgba(212,175,55,0.22)",
              borderRadius: 26,
              padding: 26,
              background: "rgba(0,0,0,0.32)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ color: "#d4af37", fontSize: 18 }}>Sepetin boş</div>
            <div style={{ marginTop: 10, opacity: 0.8, lineHeight: 1.8 }}>
              Mağazadan hediye seti ekleyebilir veya parfümünü oluşturabilirsin.
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <Link
                href="/magaza"
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  borderRadius: 999,
                  border: "1px solid #d4af37",
                  color: "#08040b",
                  background: "#d4af37",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Hediye Setlerine Git
              </Link>

              <Link
                href="/olustur"
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(212,175,55,0.45)",
                  color: "#d4af37",
                  background: "transparent",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                Parfümünü Oluştur
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: 18,
              alignItems: "start",
            }}
          >
            {/* ITEMS */}
            <div style={{ display: "grid", gap: 14 }}>
              {items.map((it: any, idx) => {
                // ✅ Gift tespitini sağlamlaştır:
                // - kind === "gift" ise gift
                // - ya da tier/essences gibi gift’e özgü alanlar varsa gift
                const isGift =
                  it?.kind === "gift" ||
                  it?.tier === "standard" ||
                  it?.tier === "premium" ||
                  Array.isArray(it?.essences);

                // ✅ Custom parfüm ismi
                const customName =
                  (typeof it?.name === "string" && it.name.trim()) ||
                  (typeof it?.perfumeName === "string" && it.perfumeName.trim()) ||
                  "";

                // Gift başlığı: title varsa onu; yoksa tier’a göre Standart/Premium Paket
                const giftTitle =
                  (typeof it?.title === "string" && it.title.trim()) ||
                  (it?.tier === "premium"
                    ? "Premium Paket"
                    : it?.tier === "standard"
                    ? "Standart Paket"
                    : "Hediye Seti");

                const headerTitle = isGift
                  ? giftTitle
                  : customName
                  ? customName
                  : `Kişisel Parfüm #${idx + 1}`;

                return (
                  <div
                    key={it.id}
                    style={{
                      border: "1px solid rgba(212,175,55,0.22)",
                      borderRadius: 24,
                      padding: 20,
                      background: "rgba(0,0,0,0.32)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        gap: 14,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: "#d4af37",
                            fontSize: 16,
                            letterSpacing: "0.5px",
                          }}
                        >
                          {headerTitle}
                        </div>

                        {isGift ? (
                          <div style={{ marginTop: 10, opacity: 0.92, lineHeight: 1.9 }}>
                            <div style={{ marginTop: 2, opacity: 0.9 }}>
                              <b>Esanslar:</b>{" "}
                              {Array.isArray(it.essences) ? it.essences.join(", ") : "—"}
                            </div>

                            <div
                              style={{
                                marginTop: 8,
                                display: "flex",
                                gap: 12,
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              <b>Şişe:</b> {it?.bottle?.name || "Sistem seçimi"}
                              {it?.bottle?.image && (
                                <span
                                  style={{
                                    width: 34,
                                    height: 50,
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.10)",
                                    background: "rgba(0,0,0,0.22)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                  }}
                                >
                                  <Image
                                    src={it.bottle.image}
                                    alt={it.bottle.name}
                                    width={34}
                                    height={50}
                                    style={{ objectFit: "contain" }}
                                  />
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.9 }}>
                            <div>
                              <b>Üst:</b> {it.topNote} — %{it.ratios?.top}
                            </div>
                            <div>
                              <b>Orta:</b> {it.midNote} — %{it.ratios?.mid}
                            </div>
                            <div>
                              <b>Alt:</b> {it.baseNote} — %{it.ratios?.base}
                            </div>
                            <div>
                              <b>Baz:</b>{" "}
                              {it.baseType === "alkol" ? "Alkol Bazlı" : "Yağ Bazlı"}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: "right", minWidth: 150 }}>
                        <div style={{ color: "#d4af37", fontSize: 20 }}>
                          {formatTL(it.price || 0)}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeItem(it.id);
                          }}
                          style={{
                            marginTop: 10,
                            padding: "10px 14px",
                            borderRadius: 14,
                            border: "1px solid rgba(212,175,55,0.45)",
                            background: "transparent",
                            color: "#d4af37",
                            cursor: "pointer",
                          }}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUMMARY */}
            <div
              style={{
                border: "1px solid rgba(212,175,55,0.22)",
                borderRadius: 26,
                padding: 22,
                background: "rgba(0,0,0,0.32)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
                position: "sticky",
                top: 110,
              }}
            >
              <div style={{ color: "#d4af37", fontSize: 18 }}>Sipariş Özeti</div>

              <div style={{ marginTop: 14, opacity: 0.85, lineHeight: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Ürün adedi</span>
                  <span style={{ color: "#d4af37" }}>{items.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Ara toplam</span>
                  <span style={{ color: "#d4af37" }}>{formatTL(totalPrice)}</span>
                </div>

                <div
                  style={{
                    height: 1,
                    background: "rgba(212,175,55,0.22)",
                    margin: "14px 0",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 18,
                  }}
                >
                  <b>Toplam</b>
                  <b style={{ color: "#d4af37" }}>{formatTL(totalPrice)}</b>
                </div>
              </div>

              <Link
                href="/odeme"
                style={{
                  display: "block",
                  marginTop: 18,
                  width: "100%",
                  textAlign: "center",
                  padding: 14,
                  borderRadius: 999,
                  border: "1px solid #d4af37",
                  background: "#d4af37",
                  color: "#08040b",
                  fontWeight: 900,
                  letterSpacing: "0.4px",
                  textDecoration: "none",
                }}
              >
                Ödemeye Geç
              </Link>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  clearCart();
                }}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: 13,
                  borderRadius: 999,
                  border: "1px solid rgba(212,175,55,0.45)",
                  background: "transparent",
                  color: "#d4af37",
                  cursor: "pointer",
                }}
              >
                Sepeti Temizle
              </button>

              <div style={{ marginTop: 14, fontSize: 12, opacity: 0.7 }}>
                Ödeme adımında teslimat bilgilerini alacağız.
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
