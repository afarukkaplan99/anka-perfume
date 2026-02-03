"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollGuard() {
  const pathname = usePathname();

  useEffect(() => {
    // ✅ Route değiştiğinde body scroll'u garanti aç
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";

    // Bazı tarayıcılarda html de kilitlenebiliyor
    document.documentElement.style.overflow = "auto";
  }, [pathname]);

  return null;
}
