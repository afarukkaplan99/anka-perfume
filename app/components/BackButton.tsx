"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);

  // Mobilde görünmesin (768px üstü = desktop/tablet)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();

    // Safari uyumu
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  // Ana sayfada olmasın
  if (pathname === "/") return null;
  // Desktop değilse hiç render etme
  if (!isDesktop) return null;

  const onBack = () => {
    if (typeof window !== "undefined" && window.history.length <= 1) {
      router.push("/");
      return;
    }
    router.back();
  };

  return (
    <button
      onClick={onBack}
      aria-label="Geri dön"
      style={{
        position: "fixed",
        top: 24,
        left: 24,
        zIndex: 4500,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        height: 48,
        padding: "0 14px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.18)",
        border: "1px solid rgba(212,175,55,0.25)",
        color: "#d4af37",
        backdropFilter: "blur(10px)",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span style={{ fontSize: 14, letterSpacing: 0.2 }}>Geri</span>
    </button>
  );
}
