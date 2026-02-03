import "./globals.css";
import type { Metadata } from "next";

import HamburgerMenu from "./components/HamburgerMenu";
import BackButton from "./components/BackButton";

export const metadata: Metadata = {
  title: {
    default: "Anka Parfüm",
    template: "%s • Anka Parfüm",
  },
  description:
    "Anka Parfüm — Koku bir tercihten fazlasıdır. Gücün, zarafetin ve imzanın ifadesidir.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Anka Parfüm",
    description: "Krallar için tasarlanan, imza niteliğinde lüks parfümler.",
    siteName: "Anka Parfüm",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* ✅ Scroll kilidi bırakma bug’larına karşı: her yüklemede + her route değişiminde unlock */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  function unlockScroll() {
    try {
      var html = document.documentElement;
      var body = document.body;
      if (!html || !body) return;

      // Bazı durumlarda menü/drawer body’ye overflow hidden bırakabiliyor.
      // Biz her route değişiminde güvenli şekilde geri açıyoruz.
      html.style.overflowX = 'hidden';
      html.style.overflowY = 'auto';
      body.style.overflowX = 'hidden';
      body.style.overflowY = 'auto';

      // Body’ye height/position ile kilit atıldıysa nazikçe temizle
      if (body.style.position === 'fixed') body.style.position = '';
      if (body.style.top) body.style.top = '';
      if (body.style.left) body.style.left = '';
      if (body.style.right) body.style.right = '';
      if (body.style.width) body.style.width = '';
    } catch (e) {}
  }

  // İlk yükleme
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', unlockScroll, { once: true });
  } else {
    unlockScroll();
  }

  // Next.js App Router: pushState / replaceState / popstate yakala
  var _pushState = history.pushState;
  var _replaceState = history.replaceState;

  history.pushState = function () {
    var r = _pushState.apply(this, arguments);
    setTimeout(unlockScroll, 0);
    return r;
  };

  history.replaceState = function () {
    var r = _replaceState.apply(this, arguments);
    setTimeout(unlockScroll, 0);
    return r;
  };

  window.addEventListener('popstate', function () {
    setTimeout(unlockScroll, 0);
  });

  // Link tıklamalarında da (özellikle hızlı geçişlerde) tekrar dene
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    // aynı sayfa anchor ise de kilit kalmasın
    setTimeout(unlockScroll, 0);
  }, true);
})();
            `,
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100dvh",
          backgroundColor: "#08040b",
          color: "white",
          fontFamily: `"Playfair Display", serif`,

          /* 🔒 scroll kontrolü */
          overflowX: "hidden",
          overflowY: "auto",
          scrollbarGutter: "stable",

          // ✅ Touch/trackpad scroll güvenliği
          touchAction: "pan-y",

          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",

          position: "relative",
          isolation: "isolate",
        }}
      >
        {/* 🌑 GLOBAL CINEMATIC BACKDROP */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            pointerEvents: "none",
            background: `
              radial-gradient(1400px 700px at top,
                rgba(120,40,180,0.22),
                transparent 60%
              ),
              radial-gradient(900px 500px at 80% 20%,
                rgba(212,175,55,0.10),
                transparent 60%
              ),
              linear-gradient(180deg, #0a0410, #08040b)
            `,
          }}
        />

        {/* 🎥 PREMIUM VIGNETTE (kenar kararması) */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
            background:
              "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* ☰ TEK MERKEZ MENÜ */}
        <HamburgerMenu />

        {/* ← GERİ BUTONU (Desktop'ta, ana sayfa hariç) */}
        <BackButton />

        {/* 🏛️ SAHNE (PAGE CONTENT) */}
        <div
          className="anka-page"
          style={{
            position: "relative",
            zIndex: 1,
            willChange: "opacity, transform",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
