"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // route değişiminde animasyonu yeniden tetiklemek için
  const [tick, setTick] = useState(0);

  // erişilebilirlik
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setTick((x) => x + 1);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();

    // Safari uyumu
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  const overlayKey = useMemo(() => `veil-${tick}`, [tick]);
  const contentKey = useMemo(() => `content-${pathname}-${tick}`, [pathname, tick]);

  if (reducedMotion) {
    return <div style={{ willChange: "opacity" }}>{children}</div>;
  }

  return (
    <>
      {/* Tek dosyada kalsın diye global keyframes */}
      <style jsx global>{`
        /* İçerik: sessiz bir “fade + micro-scale + micro-blur” */
        @keyframes ankaContentIn {
          0% {
            opacity: 0;
            transform: translateY(8px) scale(0.996);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: blur(0px);
          }
        }

        /* Çok düşük opaklıklı “luxury veil” (imza gibi, gözü yormaz) */
        @keyframes ankaVeilSweep {
          0% {
            opacity: 0;
            transform: translateY(-10px);
            filter: blur(12px);
          }
          18% {
            opacity: 1;
          }
          72% {
            opacity: 0.85;
          }
          100% {
            opacity: 0;
            transform: translateY(12px);
            filter: blur(16px);
          }
        }

        /* İnce “grain” hissi — neredeyse görünmez, premium dokunuş */
        @keyframes ankaGrainFloat {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.035;
          }
          100% {
            transform: translate3d(-2%, 1.5%, 0);
            opacity: 0.03;
          }
        }
      `}</style>

      {/* Premium veil: çok hafif ışık perdesi */}
      <div
        key={overlayKey}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          opacity: 0,
          animation: "ankaVeilSweep 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
          background:
            "radial-gradient(900px 420px at 14% 10%, rgba(212,175,55,0.11), transparent 58%)," +
            "radial-gradient(760px 340px at 86% 16%, rgba(160,90,220,0.085), transparent 62%)," +
            "linear-gradient(180deg, rgba(255,255,255,0.055), transparent 45%, rgba(0,0,0,0.12))",
          mixBlendMode: "soft-light",
        }}
      />

      {/* Neredeyse görünmez grain/doku */}
      <div
        key={`${overlayKey}-grain`}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 2px, transparent 4px)",
          mixBlendMode: "overlay",
          opacity: 0,
          animation:
            "ankaVeilSweep 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both, ankaGrainFloat 900ms ease-in-out alternate infinite",
        }}
      />

      {/* İçerik animasyonu */}
      <div
        key={contentKey}
        style={{
          position: "relative",
          zIndex: 1,
          willChange: "opacity, transform, filter",
          animation: "ankaContentIn 720ms cubic-bezier(0.18, 0.78, 0.22, 1) both",
        }}
      >
        {children}
      </div>
    </>
  );
}
