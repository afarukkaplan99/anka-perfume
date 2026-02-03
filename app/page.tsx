"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HeroVideo from "./HeroVideo";

type Dashboard = {
  announcements: { id: string; title: string; body: string; tag?: string; date?: string }[];
};

export default function HomePage() {
  const router = useRouter();

  const [isAuthed, setIsAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [annOpen, setAnnOpen] = useState(false);
  const [annLoading, setAnnLoading] = useState(false);
  const [annErr, setAnnErr] = useState<string | null>(null);
  const [ann, setAnn] = useState<Dashboard["announcements"]>([]);

  const annRootRef = useRef<HTMLDivElement | null>(null);

  // Auth check
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
        const json = await res.json().catch(() => ({}));
        setIsAuthed(Boolean(res.ok && (json?.ok || json?.user)));
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  // Background dynamics
  useEffect(() => {
    const root = document.documentElement;

    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      root.style.setProperty("--mouse-x", `${x}px`);
      root.style.setProperty("--mouse-y", `${y}px`);
    };

    const handleScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      root.style.setProperty("--density", `${0.18 + ratio * 0.25}`);
    };

    handleScroll();
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouse as any);
      window.removeEventListener("scroll", handleScroll as any);
    };
  }, []);

  const annCount = useMemo(() => ann.length || 0, [ann]);

  // Load announcements when opened (lazy)
  useEffect(() => {
    if (!annOpen) return;
    if (ann.length) return;

    (async () => {
      try {
        setAnnErr(null);
        setAnnLoading(true);
        const res = await fetch("/api/dashboard", { cache: "no-store", credentials: "include" });
        const txt = await res.text();
        if (!res.ok) {
          setAnnErr(`Duyurular alınamadı. (${res.status})`);
          return;
        }
        const data = JSON.parse(txt) as Dashboard;
        setAnn(Array.isArray(data?.announcements) ? data.announcements : []);
      } catch {
        setAnnErr("Duyurular alınamadı.");
      } finally {
        setAnnLoading(false);
      }
    })();
  }, [annOpen, ann.length]);

  // Close announcements on outside click / ESC
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!annOpen) return;
      const t = e.target as Node;
      if (annRootRef.current && !annRootRef.current.contains(t)) setAnnOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAnnOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [annOpen]);

  return (
    <>
      {/* TOP BAR */}
      <header className="topbar" role="banner">
        <div className="topbarInner">
          <div className="annWrap" ref={annRootRef}>
            <button className="pill" type="button" onClick={() => setAnnOpen((v) => !v)} aria-expanded={annOpen}>
              <BellIcon />
              <span className="pillText">Duyurular</span>
              {annCount > 0 ? <span className="miniBadge">{annCount}</span> : null}
            </button>

            {annOpen ? (
              <div className="annPanel" role="dialog" aria-label="Duyurular paneli">
                <div className="annHead">
                  <div>
                    <div className="annTitle">Duyurular</div>
                    <div className="annSub">Anka’dan en son gelişmeler</div>
                  </div>
                  <button className="xBtn" type="button" onClick={() => setAnnOpen(false)} aria-label="Kapat">
                    ✕
                  </button>
                </div>

                <div className="annBody">
                  {annLoading ? (
                    <div className="annEmpty">Yükleniyor…</div>
                  ) : annErr ? (
                    <div className="annEmpty">{annErr}</div>
                  ) : ann.length ? (
                    <div className="annList">
                      {ann.slice(0, 5).map((a) => (
                        <div key={a.id} className="annItem">
                          <div className="annTop">
                            <div className="annItemT">{a.title}</div>
                            {a.tag ? <span className="tag">{a.tag}</span> : null}
                          </div>
                          <div className="annItemB">{a.body}</div>
                          {a.date ? (
                            <div className="annItemD">{new Date(a.date).toLocaleDateString("tr-TR")}</div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="annEmpty">Henüz duyuru yok.</div>
                  )}
                </div>

                <div className="annFoot">
                  <button
                    className="miniGoldBtn"
                    type="button"
                    onClick={() => router.push(isAuthed ? "/hesabim" : "/giris")}
                  >
                    {isAuthed ? "PANELE GİT" : "GİRİŞ YAP"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="spacer" />

          <div className="right">
            {!authChecked ? (
              <span className="skeleton" aria-hidden />
            ) : isAuthed ? (
              <button className="goldBtn" type="button" onClick={() => router.push("/hesabim")}>
                PANEL
              </button>
            ) : (
              <>
                <button className="ghostBtn" type="button" onClick={() => router.push("/giris")}>
                  GİRİŞ YAP
                </button>
                <button className="goldBtn" type="button" onClick={() => router.push("/kayit")}>
                  KAYIT OL
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* BACKGROUND */}
      <div className="bg" aria-hidden>
        <div className="videoWrap">
          <HeroVideo />
          <div className="videoOverlay" />
        </div>
        <div className="particles" />
        <div className="smoke" />
      </div>

      {/* HERO */}
      <main className="hero">
        <div className="heroInner">
          <div className="logoWrap">
            <Image src="/logo.png" alt="Anka" width={220} height={220} priority />
          </div>

          <h1 className="headline">Kokun, İmzan.</h1>
          <p className="subline">“Bir kez fark edilir, unutulmaz.”</p>

          <button className="cta" type="button" onClick={() => router.push("/magaza")}>
            DENEYİMİ BAŞLAT
          </button>

          <div className="micro">Anka Parfüm • Premium kişiselleştirme deneyimi</div>
        </div>
      </main>

      <style jsx>{`
        :root {
          --mouse-x: 0px;
          --mouse-y: 0px;
          --density: 0.2;
        }

        /* BACKGROUND */
        .bg {
          position: fixed;
          inset: 0;
          background: linear-gradient(180deg, #1a0824, #08040b);
          overflow: hidden;
          z-index: 0;
        }
        .videoWrap {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .videoOverlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          pointer-events: none;
        }
        .particles,
        .smoke {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .particles::before,
        .particles::after {
          content: "";
          position: absolute;
          inset: -300px;
          background-image: radial-gradient(rgba(0, 0, 0, var(--density)) 1px, transparent 1px);
          background-size: 4px 4px;
          transform: translate(calc(var(--mouse-x) * 1), calc(var(--mouse-y) * 1));
          animation: drift 180s linear infinite;
        }
        .particles::after {
          background-size: 3px 3px;
          opacity: 0.35;
          animation-duration: 240s;
        }
        .smoke {
          position: absolute;
          inset: -200px;
          background: radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.03), transparent 60%);
          filter: blur(90px);
          animation: smoke 70s ease-in-out infinite alternate;
        }
        @keyframes drift {
          from {
            transform: translate(var(--mouse-x), var(--mouse-y)) translateY(0);
          }
          to {
            transform: translate(var(--mouse-x), var(--mouse-y)) translateY(-1400px);
          }
        }
        @keyframes smoke {
          from {
            transform: translateY(0) scale(1);
          }
          to {
            transform: translateY(-220px) scale(1.1);
          }
        }

        /* TOPBAR */
        .topbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          padding: 10px 14px;
          pointer-events: none;
        }
        .topbarInner {
          pointer-events: auto;
          height: 56px;
          max-width: 1200px;
          margin: 0 auto;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: linear-gradient(90deg, rgba(10, 8, 14, 0.62), rgba(10, 8, 14, 0.46));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 12px;
          box-shadow: 0 18px 55px rgba(0, 0, 0, 0.38);
        }
        .spacer {
          flex: 1;
        }
        .right {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 72px; /* global hamburger ile çakışmasın */
        }

        /* reset */
        button {
          font: inherit;
          border: none;
          background: none;
          color: inherit;
          cursor: pointer;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Duyurular */
        .annWrap {
          position: relative;
        }
        .pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.92);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.2px;
          transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }
        .pill:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .pillText {
          transform: translateY(0.5px);
        }
        .miniBadge {
          position: absolute;
          top: -7px;
          right: -7px;
          min-width: 18px;
          height: 18px;
          padding: 0 6px;
          border-radius: 999px;
          background: rgba(212, 175, 55, 0.95);
          color: #1b0f28;
          font-size: 11px;
          font-weight: 950;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
        }

        /* Premium buttons */
        .ghostBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.92);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.22px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
          transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }
        .ghostBtn:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.26);
        }

        .goldBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.96), rgba(255, 185, 90, 0.66));
          color: #1b0f28;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.25px;
          box-shadow: 0 16px 40px rgba(212, 175, 55, 0.12), 0 18px 45px rgba(0, 0, 0, 0.22);
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        }
        .goldBtn:hover {
          transform: translateY(-1px);
          filter: brightness(1.02);
          box-shadow: 0 22px 58px rgba(212, 175, 55, 0.14), 0 22px 60px rgba(0, 0, 0, 0.28);
        }

        .skeleton {
          width: 110px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
          background-size: 200% 100%;
          animation: sk 1.2s ease-in-out infinite;
        }
        @keyframes sk {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Ann panel */
        .annPanel {
          position: absolute;
          left: 0;
          top: calc(100% + 10px);
          width: min(520px, calc(100vw - 24px));
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: radial-gradient(1200px 260px at 30% 0%, rgba(212, 175, 55, 0.1), transparent 65%),
            rgba(10, 8, 14, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .annHead {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 14px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .annTitle {
          color: rgba(255, 255, 255, 0.96);
          font-weight: 950;
          font-size: 14px;
          letter-spacing: 0.2px;
        }
        .annSub {
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.66);
          font-size: 12px;
          line-height: 1.4;
        }
        .xBtn {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          padding: 6px 10px;
          transition: transform 0.14s ease, background 0.14s ease;
        }
        .xBtn:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.08);
        }
        .annBody {
          padding: 12px 14px;
        }
        .annList {
          display: grid;
          gap: 10px;
        }
        .annItem {
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          padding: 12px;
        }
        .annTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .annItemT {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 900;
          font-size: 13px;
          line-height: 1.25;
        }
        .annItemB {
          margin-top: 6px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          line-height: 1.55;
        }
        .annItemD {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.55);
          font-size: 11px;
        }
        .tag {
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.25);
          background: rgba(212, 175, 55, 0.1);
          color: rgba(255, 230, 170, 0.95);
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
        }
        .annEmpty {
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
          padding: 8px 0;
        }
        .annFoot {
          padding: 12px 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: flex-end;
        }
        .miniGoldBtn {
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.25);
          background: rgba(212, 175, 55, 0.1);
          color: rgba(255, 230, 170, 0.95);
          font-weight: 950;
          letter-spacing: 0.25px;
          transition: transform 0.16s ease, background 0.16s ease;
        }
        .miniGoldBtn:hover {
          transform: translateY(-1px);
          background: rgba(212, 175, 55, 0.14);
        }

        /* HERO */
        .hero {
          position: relative;
          z-index: 2;
          min-height: 100dvh;
          padding: 0 24px;
          padding-top: 100px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .heroInner {
          width: 100%;
          max-width: 920px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translateY(-74px); /* CTA kesin görünür */
        }
        .logoWrap {
          opacity: 0.98;
          filter: drop-shadow(0 18px 35px rgba(0, 0, 0, 0.35));
        }
        .headline {
          margin-top: 14px;
          font-size: 64px;
          letter-spacing: 1px;
          color: #d4af37;
          font-weight: 500;
          text-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
        }
        .subline {
          margin-top: 12px;
          font-size: 18px;
          max-width: 560px;
          opacity: 0.78;
          line-height: 1.65;
        }
        .cta {
          margin-top: 18px;
          padding: 18px 54px;
          border-radius: 999px;
          background: rgba(23, 2, 43, 0.72);
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.65);
          letter-spacing: 1.2px;
          font-weight: 950;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 18px 55px rgba(0, 0, 0, 0.32);
          transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
        }
        .cta:hover {
          transform: translateY(-2px);
          background: rgba(212, 175, 55, 0.95);
          color: #2b143c;
          box-shadow: 0 26px 80px rgba(0, 0, 0, 0.4);
        }
        .micro {
          margin-top: 14px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
          letter-spacing: 0.5px;
        }

        @media (max-width: 720px) {
          .headline {
            font-size: 54px;
          }
          .heroInner {
            transform: translateY(-62px);
          }
          .right {
            padding-right: 92px;
          }
        }
        @media (max-width: 520px) {
          .headline {
            font-size: 44px;
          }
          .subline {
            font-size: 16px;
          }
          .cta {
            padding: 16px 36px;
          }
          .heroInner {
            transform: translateY(-56px);
          }
          .right {
            padding-right: 90px;
          }
        }
      `}</style>
    </>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Zm7-6V11c0-3.07-1.63-5.64-4.5-6.32V4a2.5 2.5 0 0 0-5 0v.68C6.63 5.36 5 7.92 5 11v5l-2 2v1h20v-1l-2-2Z"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
