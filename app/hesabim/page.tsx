"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Dashboard = {
  announcements: { id: string; title: string; body: string; tag?: string; date?: string }[];
  campaigns: { id: string; title: string; body: string; badge?: string; expiresAt?: string }[];
  giftCodes: { id: string; code: string; desc: string; status: "active" | "used" | "expired" }[];
  newScents: { id: string; name: string; notes: string[]; status?: string }[];
};

export default function HesabimDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ email: string } | null>(null);
  const [dash, setDash] = useState<Dashboard | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Günaydın";
    if (h < 18) return "İyi günler";
    return "İyi akşamlar";
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setErr(null);
        setLoading(true);

        // 1) kullanıcı var mı?
        const meRes = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });
        if (!meRes.ok) {
          router.replace("/giris?next=/hesabim");
          return;
        }
        const meData = await meRes.json();
        if (!cancelled) setMe(meData.user);

        // 2) dashboard
        const dRes = await fetch("/api/dashboard", { cache: "no-store", credentials: "include" });
        const dText = await dRes.text();
        if (!dRes.ok) {
          if (!cancelled) setErr(`Panel verileri alınamadı. (${dRes.status}) ${dText}`);
          return;
        }

        const d = JSON.parse(dText) as Dashboard;
        if (!cancelled) setDash(d);
      } catch (e: any) {
        if (!cancelled) setErr("Beklenmeyen bir hata oluştu. Konsolu kontrol et.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      window.location.href = "/";
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setToast("Kod kopyalandı");
  }

  if (loading) {
    return (
      <div style={baseWrap}>
        <div style={shell}>
          <div style={{ color: "#fff", opacity: 0.9 }}>Yükleniyor…</div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={baseWrap}>
        <div style={shell}>
          <div style={card}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Bir sorun oluştu</div>
            <div style={{ marginTop: 10, color: "rgba(255,255,255,0.7)", whiteSpace: "pre-wrap" }}>{err}</div>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={btnGhost} onClick={() => location.reload()}>
                Yenile
              </button>
              <button style={btnGold} onClick={() => router.replace("/giris?next=/hesabim")}>
                Tekrar giriş
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const campaigns = dash?.campaigns || [];
  const giftCodes = dash?.giftCodes || [];
  const newScents = dash?.newScents || [];
  const announcements = dash?.announcements || [];

  return (
    <div style={baseWrap}>
      <div style={shell}>
        {/* top bar */}
        <div style={topBar}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>Anka • Müşteri Paneli</div>
            <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, marginTop: 2 }}>
              {greeting}, {me?.email}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={btnGold} onClick={() => router.push("/olustur")}>
              Parfüm Oluştur
            </button>
            <button style={btnGhost} onClick={logout}>
              Çıkış
            </button>
          </div>
        </div>

        {/* grid */}
        <div style={grid}>
          <PanelCard title="Kampanyalar" subtitle="Sana özel indirimler">
            {campaigns.length ? (
              <div style={{ display: "grid", gap: 10 }}>
                {campaigns.map((c) => (
                  <div key={c.id} style={miniCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700 }}>{c.title}</div>
                        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>{c.body}</div>
                      </div>
                      {c.badge ? <Pill>{c.badge}</Pill> : null}
                    </div>
                    {c.expiresAt ? (
                      <div style={{ marginTop: 10, color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                        Son: {formatDateTR(c.expiresAt)}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <Empty>Şu an aktif kampanya yok.</Empty>
            )}
          </PanelCard>

          <PanelCard title="Hediye Kodların" subtitle="Sepette kullan">
            {giftCodes.length ? (
              <div style={{ display: "grid", gap: 10 }}>
                {giftCodes.map((g) => (
                  <div key={g.id} style={miniCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Kod</div>
                        <div style={{ color: "#fff", fontWeight: 800, letterSpacing: 2, fontSize: 16, marginTop: 2 }}>
                          {g.code}
                        </div>
                      </div>
                      <button style={btnGhostSmall} onClick={() => copy(g.code)}>
                        Kopyala
                      </button>
                    </div>

                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 8 }}>{g.desc}</div>
                    <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 10 }}>
                      Durum:{" "}
                      {g.status === "active" ? (
                        <span style={{ color: "rgba(255,215,130,0.95)" }}>Aktif</span>
                      ) : g.status === "used" ? (
                        "Kullanıldı"
                      ) : (
                        "Süresi doldu"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>Hediye kodun yok.</Empty>
            )}
          </PanelCard>

          <PanelCard title="Yeni Kokular" subtitle="Yeni çıkanlar">
            {newScents.length ? (
              <div style={{ display: "grid", gap: 10 }}>
                {newScents.map((s) => (
                  <div key={s.id} style={miniCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 800 }}>{s.name}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                          {s.notes.map((n) => (
                            <span key={n} style={chip}>
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                      {s.status ? <Pill>{s.status}</Pill> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty>Yeni koku bildirimi yok.</Empty>
            )}
          </PanelCard>
        </div>

        {/* announcements */}
        <div style={{ ...card, marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 900 }}>Haberler & Duyurular</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 4 }}>
                Anka’dan en son gelişmeler
              </div>
            </div>
            <button style={btnGhost} onClick={() => alert("Bildirim tercihleri yakında")}>
              Bildirim Ayarları
            </button>
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            {announcements.length ? (
              announcements.map((a) => (
                <div key={a.id} style={{ ...miniCard, background: "rgba(0,0,0,0.22)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: 800 }}>{a.title}</div>
                      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 6 }}>{a.body}</div>
                    </div>
                    {a.tag ? <Pill>{a.tag}</Pill> : null}
                  </div>
                  {a.date ? (
                    <div style={{ marginTop: 10, color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                      {formatDateTR(a.date)}
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div style={{ color: "rgba(255,255,255,0.7)" }}>Henüz duyuru yok.</div>
            )}
          </div>
        </div>
      </div>

      {/* toast */}
      {toast ? (
        <div style={toastWrap}>
          <div style={toastBox}>{toast}</div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- helpers + UI ---------- */

function PanelCard(props: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={card}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>{props.title}</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 4 }}>{props.subtitle}</div>
      </div>
      {props.children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span style={pill}>{children}</span>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div style={empty}>{children}</div>;
}

function formatDateTR(input: string) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return input;
  return d.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "2-digit" });
}

/* ---------- styles (Tailwind olmasa da düzgün görünsün diye inline) ---------- */

const baseWrap: React.CSSProperties = {
  minHeight: "100vh",
  background: "radial-gradient(1200px 700px at 20% 10%, rgba(255,205,120,0.08), transparent 60%), radial-gradient(900px 600px at 80% 30%, rgba(160,90,255,0.10), transparent 60%), #07070a",
  color: "#fff",
};

const shell: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "18px 16px 40px",
};

const topBar: React.CSSProperties = {
  position: "sticky" as const,
  top: 0,
  zIndex: 20,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "14px 12px",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(7,7,10,0.72)",
  backdropFilter: "blur(10px)",
};

const grid: React.CSSProperties = {
  marginTop: 16,
  display: "grid",
  gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
};

const card: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  padding: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
};

const miniCard: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
  padding: 14,
};

const pill: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(255,215,130,0.25)",
  background: "rgba(255,215,130,0.10)",
  color: "rgba(255,230,170,0.95)",
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
  height: "fit-content",
};

const chip: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
  padding: "5px 8px",
  fontSize: 12,
  color: "rgba(255,255,255,0.78)",
};

const empty: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.03)",
  padding: 14,
  color: "rgba(255,255,255,0.70)",
  fontSize: 13,
};

const btnGold: React.CSSProperties = {
  borderRadius: 999,
  padding: "10px 14px",
  border: "1px solid rgba(255,215,130,0.25)",
  background: "linear-gradient(135deg, rgba(255,215,130,0.95), rgba(255,180,90,0.65))",
  color: "#15110a",
  fontWeight: 900,
  fontSize: 13,
};

const btnGhost: React.CSSProperties = {
  borderRadius: 999,
  padding: "10px 14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 700,
  fontSize: 13,
};

const btnGhostSmall: React.CSSProperties = {
  ...btnGhost,
  padding: "8px 12px",
  fontSize: 12,
};

const toastWrap: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 18,
  display: "flex",
  justifyContent: "center",
  zIndex: 50,
};

const toastBox: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.55)",
  color: "rgba(255,255,255,0.9)",
  padding: "10px 14px",
  fontSize: 13,
};
