"use client";

import React from "react";

const CONTACT = {
  brand: "Anka Parfüm",
  email: "info@ankaparfumery.com",
  phoneDisplay: "+90 543 677 8527",
  phoneTel: "+905436778527",
  whatsappDisplay: "+90 5436778527",
  whatsappLink: "https://wa.me/905436778527",
  address:
    "Adalet Mahallesi Manas Bulvarı No:39 Folkart Towers B Kule Kat: 38  Daire: 3803  Bayraklı / İzmir",
  workingHours: [
    { day: "Pazartesi – Cuma", hours: "10:00 – 19:00" },
    { day: "Cumartesi", hours: "11:00 – 17:00" },
    { day: "Pazar", hours: "Kapalı" },
  ],
  // İstersen sonradan gerçek google maps embed linki koyarsın
  mapNote: "Harita entegrasyonu yakında eklenecek.",
};

export default function IletisimPage() {
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: { message: "Kopyalandı" } })
      );
    } catch {}
  };

  return (
    <main className="c-shell">
      <header className="c-hero">
        <div className="c-heroGlow" aria-hidden />
        <div className="c-heroInner">
          <div className="c-kicker">Anka Atelier</div>
          <h1 className="c-title">İletişim</h1>
          <p className="c-sub">
            Size özel parfümünüz için bizimle iletişime geçin. Taleplerinizi
            hızlı ve özenli şekilde yanıtlıyoruz.
          </p>
        </div>
      </header>

      <section className="c-grid">
        {/* Sol: Bilgiler */}
        <div className="c-card">
          <div className="c-cardTop">
            <div className="c-cardTitle">İletişim Bilgileri</div>
            <div className="c-badge">Premium Support</div>
          </div>

          <div className="c-items">
            <InfoRow
              label="E-posta"
              value={CONTACT.email}
              actionLabel="Kopyala"
              onAction={() => copy(CONTACT.email)}
              href={`mailto:${CONTACT.email}`}
            />
            <InfoRow
              label="Telefon"
              value={CONTACT.phoneDisplay}
              actionLabel="Ara"
              href={`tel:${CONTACT.phoneTel}`}
            />
            <InfoRow
              label="WhatsApp"
              value={CONTACT.whatsappDisplay}
              actionLabel="Yaz"
              href={CONTACT.whatsappLink}
              external
            />
            <div className="c-divider" />
            <div className="c-block">
              <div className="c-label">Adres</div>
              <div className="c-text">{CONTACT.address}</div>
            </div>

            <div className="c-divider" />

            <div className="c-block">
              <div className="c-label">Çalışma Saatleri</div>
              <div className="c-hours">
                {CONTACT.workingHours.map((x) => (
                  <div className="c-hourRow" key={x.day}>
                    <span className="c-day">{x.day}</span>
                    <span className="c-hour">{x.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="c-actions">
            <a className="c-primary" href={CONTACT.whatsappLink} target="_blank" rel="noreferrer">
              WhatsApp’tan Yaz
            </a>
            <a className="c-secondary" href={`mailto:${CONTACT.email}`}>
              E-posta Gönder
            </a>
          </div>
        </div>

        {/* Sağ: Form + Harita alanı */}
        <div className="c-card">
          <div className="c-cardTop">
            <div className="c-cardTitle">Mesaj Bırakın</div>
            <div className="c-badge soft">24h Dönüş</div>
          </div>

          <form
            className="c-form"
            onSubmit={(e) => {
              e.preventDefault();
              // burada ileride API / mail entegrasyonu bağlarsın
              alert("Mesajınız alındı. En kısa sürede dönüş yapacağız.");
            }}
          >
            <div className="c-2col">
              <Field label="Ad Soyad" placeholder="Adınız Soyadınız" required />
              <Field label="E-posta" placeholder="ornek@mail.com" type="email" required />
            </div>
            <Field label="Konu" placeholder="Örn: Özel parfüm danışmanlığı" required />
            <TextArea
              label="Mesaj"
              placeholder="Notalar, baz türü, beklentiniz, teslimat bilgisi..."
              required
            />

            <button className="c-submit" type="submit">
              Mesajı Gönder
            </button>

            <div className="c-footNote">
              Gönderim ile birlikte{" "}
              <span className="c-gold">gizlilik politikasını</span> kabul etmiş
              olursunuz.
            </div>
          </form>

          <div className="c-map">
            <div className="c-mapGlow" aria-hidden />
            <div className="c-mapInner">
              <div className="c-mapTitle">Konum</div>
              <div className="c-mapSub">{CONTACT.mapNote}</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .c-shell {
          min-height: 100dvh;
          padding: 22px 34px 44px;
          color: rgba(255, 255, 255, 0.92);
          background: radial-gradient(1200px 600px at 15% 0%, rgba(212, 175, 55, 0.16), transparent 55%),
            radial-gradient(900px 520px at 85% 10%, rgba(157, 78, 221, 0.14), transparent 55%),
            radial-gradient(900px 600px at 50% 110%, rgba(0, 0, 0, 0.82), rgba(8, 4, 11, 1));
          overflow-x: hidden;
        }

        .c-hero {
          position: relative;
          max-width: 1200px;
          margin: 0 auto 18px;
          border-radius: 28px;
          border: 1px solid rgba(212, 175, 55, 0.22);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.2));
          overflow: hidden;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.55);
        }
        .c-heroGlow {
          position: absolute;
          inset: -2px;
          background: radial-gradient(820px 240px at 45% 0%, rgba(212, 175, 55, 0.20), transparent 60%),
            radial-gradient(680px 260px at 70% 30%, rgba(255, 255, 255, 0.07), transparent 62%),
            radial-gradient(800px 300px at 10% 30%, rgba(157, 78, 221, 0.10), transparent 62%);
          filter: blur(2px);
          opacity: 0.9;
          pointer-events: none;
        }
        .c-heroInner {
          position: relative;
          padding: 26px 26px 22px;
          backdrop-filter: blur(12px);
        }
        .c-kicker {
          font-size: 12px;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.85);
          opacity: 0.9;
        }
        .c-title {
          margin: 10px 0 8px;
          font-size: 44px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: rgba(212, 175, 55, 0.95);
          text-shadow: 0 18px 60px rgba(0, 0, 0, 0.55);
        }
        .c-sub {
          margin: 0;
          max-width: 820px;
          font-size: 14px;
          opacity: 0.82;
        }

        .c-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          align-items: start;
        }

        .c-card {
          border-radius: 26px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          background: rgba(0, 0, 0, 0.34);
          backdrop-filter: blur(14px);
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.5);
          padding: 18px;
          overflow: hidden;
        }

        .c-cardTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 6px 14px;
        }
        .c-cardTitle {
          font-size: 15px;
          letter-spacing: 0.02em;
          color: rgba(212, 175, 55, 0.92);
        }
        .c-badge {
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.28);
          opacity: 0.9;
        }
        .c-badge.soft {
          border-color: rgba(212, 175, 55, 0.22);
        }

        .c-items {
          padding: 0 6px 8px;
          display: grid;
          gap: 10px;
        }
        .c-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 8px 0;
        }
        .c-block .c-label {
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 6px;
        }
        .c-text {
          font-size: 13px;
          opacity: 0.92;
          line-height: 1.45;
        }

        .c-hours {
          display: grid;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.22);
        }
        .c-hourRow {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 12px;
        }
        .c-day {
          opacity: 0.78;
        }
        .c-hour {
          color: rgba(212, 175, 55, 0.92);
        }

        .c-actions {
          margin-top: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 0 6px 6px;
        }
        .c-primary,
        .c-secondary {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 12px 14px;
          border-radius: 999px;
          font-size: 13px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 160ms ease, filter 160ms ease, opacity 160ms ease;
          user-select: none;
          white-space: nowrap;
        }
        .c-primary {
          border: 1px solid rgba(212, 175, 55, 0.65);
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.98), rgba(212, 175, 55, 0.72));
          color: rgba(8, 4, 11, 0.98);
          box-shadow: 0 24px 60px rgba(212, 175, 55, 0.12);
        }
        .c-secondary {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.22);
          color: rgba(255, 255, 255, 0.9);
        }
        .c-primary:hover,
        .c-secondary:hover {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }

        .c-form {
          padding: 0 6px 6px;
          display: grid;
          gap: 10px;
        }
        .c-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .c-submit {
          margin-top: 6px;
          width: 100%;
          padding: 14px 16px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.65);
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.98), rgba(212, 175, 55, 0.72));
          color: rgba(8, 4, 11, 0.98);
          font-size: 14px;
          cursor: pointer;
          transition: transform 160ms ease, filter 160ms ease, opacity 160ms ease;
        }
        .c-submit:hover {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }
        .c-footNote {
          font-size: 12px;
          opacity: 0.72;
          line-height: 1.35;
        }
        .c-gold {
          color: rgba(212, 175, 55, 0.95);
        }

        .c-map {
          margin-top: 14px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.25));
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          position: relative;
          min-height: 140px;
        }
        .c-mapGlow {
          position: absolute;
          inset: -80px;
          background: radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.20), transparent 60%),
            radial-gradient(circle at 30% 70%, rgba(157, 78, 221, 0.12), transparent 62%);
          filter: blur(16px);
          opacity: 0.9;
          pointer-events: none;
        }
        .c-mapInner {
          position: relative;
          padding: 16px;
        }
        .c-mapTitle {
          font-size: 13px;
          color: rgba(212, 175, 55, 0.92);
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }
        .c-mapSub {
          font-size: 12px;
          opacity: 0.75;
        }

        @media (max-width: 980px) {
          .c-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 720px) {
          .c-shell {
            padding: 18px 16px 30px;
          }
          .c-title {
            font-size: 34px;
          }
          .c-2col {
            grid-template-columns: 1fr;
          }
          .c-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function InfoRow({
  label,
  value,
  actionLabel,
  onAction,
  href,
  external,
}: {
  label: string;
  value: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="i-row">
      <div className="i-left">
        <div className="i-label">{label}</div>
        {href ? (
          <a
            className="i-value"
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            {value}
          </a>
        ) : (
          <div className="i-value">{value}</div>
        )}
      </div>

      {(actionLabel || href) && (
        <div className="i-right">
          {href && (
            <a
              className="i-btn"
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
            >
              {actionLabel || "Aç"}
            </a>
          )}
          {!href && actionLabel && (
            <button className="i-btn" type="button" onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .i-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 12px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.22);
        }
        .i-label {
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 4px;
        }
        .i-value {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.92);
          text-decoration: none;
          opacity: 0.92;
        }
        .i-value:hover {
          opacity: 1;
        }
        .i-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(212, 175, 55, 0.35);
          background: rgba(0, 0, 0, 0.18);
          color: rgba(212, 175, 55, 0.92);
          font-size: 12px;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
          transition: transform 160ms ease, filter 160ms ease;
        }
        .i-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.03);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="f">
      <div className="f-label">{label}</div>
      <input className="f-input" type={type} placeholder={placeholder} required={required} />
      <style jsx>{`
        .f {
          display: grid;
          gap: 6px;
        }
        .f-label {
          font-size: 12px;
          opacity: 0.75;
        }
        .f-input {
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.22);
          padding: 0 12px;
          color: rgba(255, 255, 255, 0.92);
          outline: none;
        }
        .f-input:focus {
          border-color: rgba(212, 175, 55, 0.45);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.10);
        }
      `}</style>
    </label>
  );
}

function TextArea({
  label,
  placeholder,
  required,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="f">
      <div className="f-label">{label}</div>
      <textarea className="f-area" placeholder={placeholder} required={required} rows={6} />
      <style jsx>{`
        .f {
          display: grid;
          gap: 6px;
        }
        .f-label {
          font-size: 12px;
          opacity: 0.75;
        }
        .f-area {
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.10);
          background: rgba(0, 0, 0, 0.22);
          padding: 12px;
          color: rgba(255, 255, 255, 0.92);
          outline: none;
          resize: vertical;
        }
        .f-area:focus {
          border-color: rgba(212, 175, 55, 0.45);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.10);
        }
      `}</style>
    </label>
  );
}
