"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // drawer içindeki ilk linke focus için
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  // ✅ Scroll kilidi için eski değerleri sakla (garanti geri yükleme)
  const lockRef = useRef<{
    htmlOverflow: string;
    bodyOverflow: string;
    bodyPaddingRight: string;
    htmlPaddingRight: string;
  } | null>(null);

  const unlockScroll = () => {
    const html = document.documentElement;
    const body = document.body;
    const prev = lockRef.current;

    if (prev) {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPaddingRight;
      html.style.paddingRight = prev.htmlPaddingRight;
      lockRef.current = null;
    } else {
      // fallback
      html.style.overflowY = "auto";
      body.style.overflowY = "auto";
      body.style.overflowX = "hidden";
      html.style.overflowX = "hidden";
    }
  };

  const lockScroll = () => {
    const html = document.documentElement;
    const body = document.body;

    // zaten kilitliysek tekrar kilitleme
    if (lockRef.current) return;

    const scroller =
      (document.scrollingElement as HTMLElement) || document.documentElement;

    const scrollbarWidth = Math.max(0, window.innerWidth - scroller.clientWidth);

    lockRef.current = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      htmlPaddingRight: html.style.paddingRight,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
      html.style.paddingRight = `${scrollbarWidth}px`;
    }
  };

  // ✅ Scrollbar genişliği hesapla: --sbw
  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      const scroller =
        (document.scrollingElement as HTMLElement) || document.documentElement;
      const sbw = Math.max(0, window.innerWidth - scroller.clientWidth);
      root.style.setProperty("--sbw", `${sbw}px`);
    };

    apply();
    requestAnimationFrame(apply);

    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  // ✅ Route değişince menüyü kapat + scroll’u garanti aç
  useEffect(() => {
    unlockScroll();
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ✅ Menü açıkken scroll kilidi + ESC + kapanınca garanti unlock
  useEffect(() => {
    if (open) {
      lockScroll();

      // Açılınca ilk linke focus (accessibility + UX)
      requestAnimationFrame(() => {
        firstLinkRef.current?.focus?.();
      });
    } else {
      unlockScroll();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlockScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ✅ Component unmount olursa da kilit kalmasın
  useEffect(() => {
    return () => unlockScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Menü linkleri
  const links = useMemo(
    () => [
      { href: "/", label: "Ana Sayfa" },
      { href: "/magaza", label: "Mağaza" },
      { href: "/olustur", label: "Parfümünü Oluştur" },
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/iletisim", label: "İletişim" },
      { href: "/sepet", label: "Sepet" },
    ],
    []
  );

  return (
    <>
      {/* HAMBURGER */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menüyü Aç/Kapat"
        aria-expanded={open}
        type="button"
        style={{
          position: "fixed",
          top: "max(20px, env(safe-area-inset-top))",
          right: "calc(24px + var(--sbw, 0px))",
          zIndex: 5000,
          background: "rgba(0,0,0,0.18)",
          border: "1px solid rgba(212,175,55,0.25)",
          color: "#d4af37",
          width: 48,
          height: 48,
          borderRadius: 999,
          fontSize: 22,
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          WebkitTapHighlightColor: "transparent",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            zIndex: 4999,
          }}
        />
      )}

      {/* DRAWER */}
      <aside
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          right: "var(--sbw, 0px)",
          height: "100dvh",
          width: 320,
          background: "linear-gradient(180deg, #120816, #08040b)",
          transform: open ? "translateX(0)" : "translateX(102%)",
          transition: "transform 0.4s cubic-bezier(.2,.9,.2,1)",
          zIndex: 5001,
          padding: "40px 28px",
          borderLeft: "1px solid rgba(212,175,55,0.22)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
          <Image src="/logo.png" alt="Anka" width={160} height={160} priority />
        </div>

        <nav
          style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {links.map((l, idx) => (
            <MenuLink
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              // ilk elemana ref bağla
              innerRef={idx === 0 ? firstLinkRef : undefined}
            >
              {l.label}
            </MenuLink>
          ))}
        </nav>

        {/* Global CSS kırsa bile menü içindeki metinleri garanti altına al */}
        <style jsx>{`
          aside {
            /* global word-break/overflow-wrap vb. bozulmaları burada iptal ediyoruz */
            word-break: normal !important;
            overflow-wrap: normal !important;
            hyphens: manual !important;
          }

          @media (prefers-reduced-motion: reduce) {
            aside {
              transition: none !important;
            }
          }
        `}</style>
      </aside>
    </>
  );
}

function MenuLink({
  href,
  children,
  onClick,
  innerRef,
}: {
  href: string;
  children: string;
  onClick: () => void;
  innerRef?: React.RefObject<HTMLAnchorElement | null>;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      ref={innerRef as any}
      style={{
        color: "#d4af37",
        fontSize: 18,
        textDecoration: "none",
        letterSpacing: "0.5px",
        padding: "12px 14px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.16)",
        WebkitTapHighlightColor: "transparent",
        display: "block",

        /* ✅ metin bozulmasını engelle */
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordBreak: "normal",
        overflowWrap: "normal",
        hyphens: "manual",

        /* ✅ kutu genişliği garanti */
        width: "100%",
        boxSizing: "border-box",

        /* ✅ hover/premium hissiyat */
        transition: "transform .16s ease, background .16s ease, border-color .16s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(212,175,55,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "rgba(0,0,0,0.16)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      {children}
    </Link>
  );
}
