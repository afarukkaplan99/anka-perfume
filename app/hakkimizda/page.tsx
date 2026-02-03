"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function HakkimizdaPage() {
  // ✅ Premium “tarih/itibar” hissi: yıl sayacı
  const foundedYear = 2025;
  const [nowYear, setNowYear] = useState<number>(new Date().getFullYear());
  useEffect(() => setNowYear(new Date().getFullYear()), []);
  const heritageYears = useMemo(() => Math.max(1, nowYear - foundedYear), [nowYear]);

  // ✅ Mikro-animasyon kontrolü (reduce motion)
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(!!mq?.matches);
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);

  // ✅ Parallax: tek scrollbar (window) üzerinden
  const [scrollY, setScrollY] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (raf.current) return;
      raf.current = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY || 0);
        raf.current = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll as any);
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  const parA = reduceMotion ? 0 : Math.min(24, scrollY * 0.04);
  const parB = reduceMotion ? 0 : Math.min(34, scrollY * 0.06);

  return (
    <main
      className="about-root"
      style={{
        minHeight: "100dvh",
        overflowX: "hidden",
        width: "100%",
        background: "radial-gradient(1200px 600px at top, #2a0f3f, #09040c)",
        color: "white",
        position: "relative",
        padding: "96px 24px 96px",
      }}
    >
      <style jsx global>{`
        /* ✅ Sayfa özelinde değil, site geneli tek scrollbar için en güvenlisi */
        html,
        body {
          height: 100%;
        }
        body {
          overflow-y: auto;
          overflow-x: hidden;
        }
      `}</style>

      {/* Sayfaya özel (premium) küçük CSS */}
      <style jsx>{`
        /* ✅ premium “museum-grade” tipografi */
        .serif {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        }
        .sans {
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans",
            "Apple Color Emoji", "Segoe UI Emoji";
        }

        .hairline {
          height: 1px;
          width: 100%;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent);
          opacity: 0.9;
        }

        .kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(10px);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
          color: rgba(212, 175, 55, 0.95);
          font-weight: 900;
          letter-spacing: 0.6px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .quote {
          margin-top: 18px;
          border-left: 2px solid rgba(212, 175, 55, 0.55);
          padding-left: 14px;
          opacity: 0.92;
          line-height: 1.95;
        }

        .cta {
          margin-top: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.35);
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.16), rgba(0, 0, 0, 0.22));
          color: #d4af37;
          font-weight: 900;
          letter-spacing: 0.3px;
          text-decoration: none;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
          transition: transform 160ms ease, filter 160ms ease, box-shadow 160ms ease;
          position: relative;
          overflow: hidden;
        }
        .cta:before {
          content: "";
          position: absolute;
          inset: -2px;
          background: radial-gradient(
            500px 140px at 30% -20%,
            rgba(212, 175, 55, 0.32),
            transparent 55%
          );
          opacity: 0.9;
          pointer-events: none;
        }
        .cta:hover {
          transform: translateY(-1px);
          filter: brightness(1.06);
          box-shadow: 0 34px 95px rgba(0, 0, 0, 0.6);
        }
        .cta:active {
          transform: translateY(0px);
        }

        @keyframes ankaFloat {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -8px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes ankaSheen {
          0% {
            transform: translateX(-120%) skewX(-18deg);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          55% {
            opacity: 0.15;
          }
          100% {
            transform: translateX(140%) skewX(-18deg);
            opacity: 0;
          }
        }
        @keyframes ankaEmber {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(0, -18px, 0);
            opacity: 0.65;
          }
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.35;
          }
        }
      `}</style>

      {/* Arka plan atmosfer */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.98,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200 + parA,
            left: -170,
            width: 560,
            height: 560,
            borderRadius: 999,
            background: "rgba(212,175,55,0.10)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -240 - parB,
            right: -190,
            width: 700,
            height: 700,
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 80 + parA,
            right: -260,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: "rgba(142,60,255,0.10)",
            filter: "blur(110px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
            opacity: 0.16,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.10'/%3E%3C/svg%3E\")",
            opacity: 0.22,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <section
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1040,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Üst başlık */}
        <header style={{ textAlign: "center", marginBottom: 42 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                width: 170,
                height: 170,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background:
                  "radial-gradient(60px 60px at 30% 25%, rgba(212,175,55,0.25), rgba(0,0,0,0) 65%), radial-gradient(120px 120px at 70% 70%, rgba(255,255,255,0.08), rgba(0,0,0,0) 70%)",
                border: "1px solid rgba(212,175,55,0.20)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -2,
                  borderRadius: 999,
                  border: "1px solid rgba(212,175,55,0.16)",
                  background:
                    "radial-gradient(500px 160px at 50% -10%, rgba(212,175,55,0.18), transparent 55%)",
                  opacity: 0.9,
                }}
              />
              <Image
                src="/logo.png"
                alt="Anka"
                width={150}
                height={150}
                style={{
                  filter: "drop-shadow(0 26px 70px rgba(0,0,0,0.60))",
                  animation: reduceMotion ? "none" : "ankaFloat 5.4s ease-in-out infinite",
                }}
                priority
              />
            </div>
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="kicker sans">
              ANKA • SIGNATURE HOUSE <span style={{ opacity: 0.7 }}>•</span> PERFUMERY
            </span>

            <span
              className="sans"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 18px 50px rgba(0,0,0,0.32)",
                color: "rgba(255,255,255,0.88)",
                fontWeight: 900,
                letterSpacing: 0.5,
                fontSize: 12,
                textTransform: "uppercase",
              }}
              title="Miras"
            >
              {foundedYear}’den beri • {heritageYears}+ yıl
            </span>
          </div>

          <h1
            className="serif"
            style={{
              margin: "18px 0 0",
              color: "#d4af37",
              fontSize: 58,
              letterSpacing: 1.2,
              fontWeight: 650,
              textShadow: "0 20px 70px rgba(0,0,0,0.55)",
            }}
          >
            Anka
          </h1>

          {/* ✅ Daha egzotik / kraliyet seviyesi anlatım */}
          <p
            className="sans"
            style={{
              margin: "12px auto 0",
              maxWidth: 860,
              opacity: 0.88,
              fontSize: 18,
              lineHeight: 1.95,
            }}
          >
            Bizim işimiz <b>koku satmak</b> değil; Biz kokuyu, hayatın görünmeyen ama en belirleyici parçası olarak{" "}
            <b>ele alırız</b>. Bir odanın hafızası, bir insanın duruşu, bir gecenin hükmü… Hepsi, tek bir izde
            birleşebilir. Burada her formül, yalnızca “güzel kokmak” için değil; <b>saygı uyandırmak</b>,{" "}
            <b></b> ve yıllar sonra bile kokun ile hatırlanman için doğar.
          </p>

          <div className="quote sans" style={{ maxWidth: 820, margin: "18px auto 0" }}>
            <span style={{ color: "#d4af37", fontWeight: 900 }}>“Lüks bir ses değildir;</span>{" "}
            <span style={{ opacity: 0.92 }}>zamana meydan okuyan bir ölçüdür.”</span>
          </div>

          <div
            className="sans"
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <Seal>Ritüel Disiplini</Seal>
            <Seal>Seçkin Özler</Seal>
            <Seal>İmza Karakter</Seal>
            <Seal>Kalıcı Zarafet</Seal>
          </div>

          <div style={{ marginTop: 22, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <a className="cta sans" href="/olustur">
              İmzanı Oluştur <span style={{ opacity: 0.8 }}>→</span>
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.16) 35%, transparent 70%)",
                  animation: reduceMotion ? "none" : "ankaSheen 2.9s ease-in-out infinite",
                }}
              />
            </a>

            <a
              className="cta sans"
              href="/magaza"
              style={{
                borderColor: "rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.88)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.22))",
              }}
            >
              Koleksiyonu Keşfet <span style={{ opacity: 0.8 }}>→</span>
            </a>
          </div>
        </header>

        <div className="hairline" />

        <div style={{ display: "grid", gap: 16, marginTop: 22 }}>
          <Card>
            <SmallTitle>Sessiz Güç & Otorite</SmallTitle>
            <p style={p}>
              Anka, kokuyu bir ürün etiketi olarak değil; hayatın en ince ama en güçlü imzası olarak görür. Varlığınız, bazen tek bir izde anlaşılır. Bu yüzden aynı kokuyu herkesin
              üzerinde görmeyi hedeflemeyiz: <b>en seçkin imza, tekildir</b>.
            </p>
          </Card>

          <Card>
            <SmallTitle>Ustalık, gösterişe ihtiyaç duymaz.</SmallTitle>
            <p style={p}>
              Gerçek kalite sesini yükseltmez; <b>denge</b> ile hükmeder. Açılışın zarafeti, kalbin ritmi, dipte kalanın
              asaleti… Atölyelerimiz’de her nota hep daha iyisini hedefleyerek derinleşmek ve yıllar sonra
              bile aynı ciddiyetle hatırlanmak için üretilir.
            </p>
          </Card>

          <Card>
            <SmallTitle>Seçkin özler bir başlangıçtır, sonuç değildir.</SmallTitle>
            <p style={p}>
              En iyilerle çalışırız; fakat ayrıcalık, içerik listesini uzatmakla doğmaz. Ayrıcalık; ham maddeyi bir
              mimariye dönüştürmek, katmanları inceltmek ve etkiyi rafine etmektir. Modern lüks budur: etkileyici ve
              unutulmaya fırsat vermez.
            </p>
          </Card>

          <Card>
            <SmallTitle>Küllerden doğan miras.</SmallTitle>
            <p style={p}>
              Anka, efsanesini bir pazarlama cümlesi olarak değil; bir <b>disiplin yemini</b> olarak taşır. Küller geçmişi
              unutturmaz; onu arıtır. Doğuş, gürültüyle değil <b>kusursuzlukla</b> ilan edilir. Bu yüzden her şişe “en
              iyisi” iddiasını değil; <b>en iyisi olmak zorunluluğunu</b> temsil eder.
            </p>
          </Card>

          <Card>
            <SmallTitle>Kokun, İmzan.</SmallTitle>
            <p style={p}>
              Anka’yı seçenler trendin peşinden koşmaz; trendi kendi varlığıyla aşar. Biz, “parfüm markası” olmanın
              ötesinde; <b>kişisel kimliğin sessiz tamamlayıcısı</b> olmayı hedefleriz. Çünkü koku, bir
              detay değil; bir duruşu tamamlayan en özel etkendir.
            </p>
          </Card>

          <Manifesto reduceMotion={reduceMotion} />
        </div>
      </section>
    </main>
  );
}

function Manifesto({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div
      style={{
        marginTop: 10,
        border: "1px solid rgba(212,175,55,0.30)",
        borderRadius: 30,
        padding: 24,
        background: "rgba(0,0,0,0.34)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 34px 90px rgba(0,0,0,0.50)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -2,
          background:
            "radial-gradient(700px 220px at 20% 0%, rgba(212,175,55,0.18), transparent 55%), radial-gradient(700px 260px at 90% 120%, rgba(255,255,255,0.06), transparent 55%)",
          pointerEvents: "none",
          opacity: 0.9,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          width: 10,
          height: 10,
          borderRadius: 999,
          background: "rgba(212,175,55,0.80)",
          boxShadow: "0 0 0 10px rgba(212,175,55,0.08), 0 0 42px rgba(212,175,55,0.35)",
          animation: reduceMotion ? "none" : "ankaEmber 3.8s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          gap: 14,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            className="sans"
            style={{
              color: "#d4af37",
              fontSize: 13,
              letterSpacing: 1.3,
              fontWeight: 950,
              textTransform: "uppercase",
              opacity: 0.95,
            }}
          >
            Manifesto
          </div>
          <div
            className="serif"
            style={{
              marginTop: 8,
              fontSize: 24,
              fontWeight: 650,
              letterSpacing: 0.2,
              textShadow: "0 18px 55px rgba(0,0,0,0.50)",
            }}
          >
            Lüks, “fazla” olmak değil; <span style={{ color: "#d4af37" }}>kusursuz</span> olmaktır.
          </div>
        </div>

        <div
          className="sans"
          style={{
            border: "1px solid rgba(212,175,55,0.35)",
            borderRadius: 999,
            padding: "10px 14px",
            background: "rgba(0,0,0,0.20)",
            color: "#d4af37",
            fontWeight: 950,
            letterSpacing: 0.5,
            fontSize: 12,
            textTransform: "uppercase",
          }}
        >
          ANKA • THE SIGNATURE
        </div>
      </div>

      <p
        className="sans"
        style={{
          position: "relative",
          marginTop: 14,
          opacity: 0.9,
          lineHeight: 1.98,
          fontSize: 16,
        }}
      >
        Biz, en iyi parfümün “en pahalı” olan değil; <b>en doğru</b> olan olduğuna inanırız. Kişinin özdeğerini
        destekleyen ve her mekânla uyum sağlayan kokularımız yıllar sonra bile aynı saygınlıkla hatırlanmanızı hedefler. Anka, bu standardı
        bir iddia olarak değil; bir <b>zorunluluk</b> olarak görür. Bu yüzden her şişe; etiketiyle değil, <b>tavrıyla</b>{" "}
        konuşur.
      </p>

      <div
        className="serif"
        style={{
          position: "relative",
          marginTop: 16,
          textAlign: "center",
          color: "#d4af37",
          fontSize: 19,
          letterSpacing: 0.4,
          opacity: 0.98,
          fontWeight: 650,
        }}
      >
        Kokunuz benzersiz olmalı. Çünkü sizden bir tane daha yok.
      </div>
    </div>
  );
}

function Seal({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 999,
        border: "1px solid rgba(212,175,55,0.22)",
        background: "rgba(0,0,0,0.18)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.30)",
        color: "rgba(255,255,255,0.90)",
        fontWeight: 900,
        letterSpacing: 0.2,
        fontSize: 12,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: "#d4af37",
          boxShadow: "0 0 0 6px rgba(212,175,55,0.10)",
        }}
      />
      <span className="sans">{children}</span>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(212,175,55,0.22)",
        borderRadius: 28,
        padding: 22,
        background: "rgba(0,0,0,0.32)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 30px 70px rgba(0,0,0,0.40)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -2,
          background:
            "radial-gradient(600px 220px at 20% 0%, rgba(212,175,55,0.10), transparent 55%), radial-gradient(600px 240px at 90% 120%, rgba(255,255,255,0.05), transparent 55%)",
          pointerEvents: "none",
          opacity: 0.9,
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

function SmallTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        color: "#d4af37",
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: 0.2,
      }}
    >
      {children}
    </h2>
  );
}

const p: React.CSSProperties = {
  marginTop: 12,
  marginBottom: 0,
  opacity: 0.86,
  lineHeight: 1.98,
  fontSize: 16,
};
