"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CART_KEY = "anka_cart";

type PersonalItem = {
  id: string;
  createdAt: number;
  topNote: string;
  midNote: string;
  baseNote: string;
  ratios: { top: number; mid: number; base: number };
  baseType: "alkol" | "yag";
  price: number;
  kind?: "personal";
};

type GiftItem = {
  id: string;
  createdAt: number;
  kind: "gift";
  title: string;
  essences: string[];
  bottle?: { name: string };
  price: number;
};

type CartItem = PersonalItem | GiftItem;

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function formatTRY(n: number) {
  return n.toLocaleString("tr-TR") + " ₺";
}

function isGiftItem(it: CartItem): it is GiftItem {
  return (it as any)?.kind === "gift";
}

/* =========================================================
   ✅ YASAL METİNLER (ÖRNEK ŞABLON)
   - Bunları kendi şirket bilgilerinizle güncelleyin.
   - Özellikle: Unvan, MERSİS/VKN, adres, e-posta, iade koşulları, kargo süreleri.
========================================================= */

const COMPANY = {
  brand: "Anka",
  title: "Anka Parfüm (MSM Periyodik Danışmanlık Ticaret Limited Şirketi)",
  address: "Adalet Mahallesi Manas Bulvarı No:39 Folkart Towers B kula kat:38 d.3803 Bayraklı-İZMİR",
  email: "info@ankaperfumery.com",
  phone: "0(543) 677 85 27",
  web: "ankaperfumery.com",
  vkn: "6231106746",
};

const PRIVACY_TEXT = `
1. Amaç
Bu Gizlilik Politikası, ${COMPANY.brand} (Msm Periyodik danışmanlık ticaret limited şirketi) tarafından ${COMPANY.web} üzerinden sunulan hizmetleri kullanmanız sırasında kişisel verilerinizin ve/veya kullanım verilerinizin hangi amaçlarla işlendiğini ve korunduğunu açıklamak için hazırlanmıştır.

2. Toplanan Veriler
Sipariş ve hizmetlerin sunulabilmesi için; ad-soyad, iletişim bilgileri (telefon/e-posta), adres bilgileri, sipariş içeriği ve işlem kayıtları gibi veriler işlenebilir. Kart bilgileriniz ödeme kuruluşu altyapısında işlenir; Şirket kart verisi saklamaz.

3. İşleme Amaçları
- Siparişin oluşturulması, hazırlanması ve teslimi,
- Müşteri iletişimi ve destek süreçlerinin yürütülmesi,
- Fatura/irsaliye süreçleri ve yasal yükümlülüklerin yerine getirilmesi,
- Güvenlik, suistimal önleme ve kayıtların tutulması,
- Talep ve şikâyet yönetimi.

4. Çerezler
Site deneyimini iyileştirmek için zorunlu ve tercihe bağlı çerezler kullanılabilir. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.

5. Veri Paylaşımı
Verileriniz; kargo/lojistik, ödeme kuruluşları, yasal zorunluluk kapsamında yetkili kamu kurumları ve hizmet sağlayıcılarla, sadece gerekli ölçüde paylaşılabilir.

6. Saklama Süresi
Veriler, ilgili mevzuatta öngörülen süreler boyunca veya işleme amaçları için gerekli süreyle sınırlı olarak saklanır.

7. Güvenlik
Veri güvenliği için uygun teknik ve idari tedbirler uygulanır. Ancak internet üzerinden iletimde mutlak güvenlik garanti edilemez.

8. İletişim
Gizlilik politikası ile ilgili talepleriniz için: ${COMPANY.email}
`;

const KVKK_TEXT = `
1. Veri Sorumlusu
6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu: ${COMPANY.title}
İletişim: ${COMPANY.address} • ${COMPANY.email} • ${COMPANY.phone}

2. İşlenen Kişisel Veriler
Kimlik ve iletişim verileri (ad-soyad, e-posta, telefon), teslimat adresi, sipariş/işlem bilgileri ve müşteri hizmetleri kayıtları.

3. İşleme Amaçları
- Sipariş süreçlerinin yürütülmesi ve teslimat,
- Finans/muhasebe süreçleri ve mevzuat yükümlülükleri,
- Müşteri destek süreçleri,
- Bilgi güvenliği ve suistimal önleme.

4. Hukuki Sebepler
KVKK m.5 kapsamında; sözleşmenin kurulması/ifası için zorunluluk, hukuki yükümlülüklerin yerine getirilmesi ve meşru menfaat.

5. Aktarım
Kargo/lojistik firmaları, ödeme kuruluşları ve hizmet sağlayıcılar ile yalnızca gerekli ölçüde paylaşım yapılabilir. Yasal zorunluluk halinde yetkili kurumlara aktarım yapılabilir.

6. Haklarınız
KVKK m.11 kapsamında; kişisel verilerin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme/silme, işlemeye itiraz gibi haklara sahipsiniz.
Başvuru: ${COMPANY.email}
`;

const DISTANCE_TEXT = `
MESAFELİ SATIŞ SÖZLEŞMESİ

1. Taraflar
SATICI: ${COMPANY.title}
Adres: ${COMPANY.address}
E-posta: ${COMPANY.email}
Tel: ${COMPANY.phone}
VKN/MERSİS: ${COMPANY.vkn}

ALICI: Sipariş ekranında bilgileri giren kişi.

2. Konu
Bu sözleşme, ALICI’nın ${COMPANY.web} üzerinden sipariş verdiği ürün/hizmetin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerini düzenler.

3. Ürün/Bedel
Ürün türü, adet, birim fiyat, kargo bedeli ve toplam tutar ödeme ekranında yer aldığı şekilde uygulanır.

4. Teslimat
Teslimat, ALICI’nın beyan ettiği adrese yapılır. Kargo süresi; stok, üretim ve yoğunluğa göre değişebilir. Mücbir sebepler halinde gecikme yaşanabilir.

5. Cayma Hakkı
ALICI, 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri çerçevesinde cayma hakkına sahiptir.
Kişiye özel üretilen/kişiselleştirilen ürünlerde cayma hakkı istisnaları uygulanabilir.
Cayma talebi için: ${COMPANY.email}

6. İade/İptal
İade koşulları ve süreçleri ilgili mevzuat çerçevesinde yürütülür. Hijyen ve kişiye özel üretim niteliği nedeniyle ambalajı açılmış ürünlerde iade kabul edilmeyebilir (mevzuat istisnaları saklıdır).

7. Uyuşmazlık
Uyuşmazlıklarda tüketici hakem heyetleri ve tüketici mahkemeleri yetkilidir.

8. Yürürlük
ALICI, ödeme ekranında bu sözleşmeyi okuduğunu ve elektronik ortamda kabul ettiğini beyan eder.
`;

/* ========================================================= */

type PolicyKey = "distance" | "privacy" | "kvkk";

export default function OdemePage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form alanları
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  // Kart alanları (demo)
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  // ✅ Yasal onaylar (modal ile)
  const [agreeDistance, setAgreeDistance] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeKvkk, setAgreeKvkk] = useState(false);

  // ✅ Modal state
  const [policyOpen, setPolicyOpen] = useState(false);
  const [policyKey, setPolicyKey] = useState<PolicyKey>("distance");

  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const c = readCart();
    setCart(c);
    setLoading(false);
  }, []);

  // ✅ Modal açıkken ESC + body scroll lock
  useEffect(() => {
    if (!policyOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPolicyOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [policyOpen]);

  const subtotal = useMemo(
    () => cart.reduce((sum, it) => sum + (Number((it as any).price) || 0), 0),
    [cart]
  );

  const shipping = useMemo(() => (cart.length > 0 ? 0 : 0), [cart]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const allAgreed = agreeDistance && agreePrivacy && agreeKvkk;

  const isFormValid = useMemo(() => {
    if (cart.length === 0) return false;
    if (!fullName.trim()) return false;
    if (!phone.trim()) return false;
    if (!email.trim()) return false;
    if (!city.trim()) return false;
    if (!district.trim()) return false;
    if (!address.trim()) return false;
    if (!cardName.trim()) return false;
    if (!cardNumber.replace(/\s/g, "").trim()) return false;
    if (!exp.trim()) return false;
    if (!cvc.trim()) return false;
    if (!allAgreed) return false;
    return true;
  }, [
    cart.length,
    fullName,
    phone,
    email,
    city,
    district,
    address,
    cardName,
    cardNumber,
    exp,
    cvc,
    allAgreed,
  ]);

  // ✅ Micro progress
  const progress = useMemo(() => {
    const checks = [
      cart.length > 0,
      !!fullName.trim(),
      !!phone.trim(),
      !!email.trim(),
      !!city.trim(),
      !!district.trim(),
      !!address.trim(),
      !!cardName.trim(),
      !!cardNumber.replace(/\s/g, "").trim(),
      !!exp.trim(),
      !!cvc.trim(),
      agreeDistance,
      agreePrivacy,
      agreeKvkk,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [
    cart.length,
    fullName,
    phone,
    email,
    city,
    district,
    address,
    cardName,
    cardNumber,
    exp,
    cvc,
    agreeDistance,
    agreePrivacy,
    agreeKvkk,
  ]);

  const progressLabel =
    progress < 40
      ? "Siparişinizi hazırlıyoruz…"
      : progress < 80
      ? "Detaylar netleşiyor…"
      : progress < 100
      ? "Son dokunuşlar…"
      : "Hazır. Onaylayabilirsiniz.";

  const openPolicy = (key: PolicyKey) => {
    setPolicyKey(key);
    setPolicyOpen(true);
  };

  const getPolicyTitle = (key: PolicyKey) => {
    if (key === "distance") return "Mesafeli Satış Sözleşmesi";
    if (key === "privacy") return "Gizlilik Politikası";
    return "KVKK Aydınlatma Metni";
  };

  const getPolicyText = (key: PolicyKey) => {
    if (key === "distance") return DISTANCE_TEXT;
    if (key === "privacy") return PRIVACY_TEXT;
    return KVKK_TEXT;
  };

  const acceptPolicy = () => {
    // ✅ İlgili checkbox’ı otomatik işaretle
    if (policyKey === "distance") setAgreeDistance(true);
    if (policyKey === "privacy") setAgreePrivacy(true);
    if (policyKey === "kvkk") setAgreeKvkk(true);

    setPolicyOpen(false);
  };

  const onPay = async () => {
    setError("");

    if (cart.length === 0) {
      setError("Sepet boş. Ödeme yapabilmek için önce ürün ekle.");
      return;
    }
    if (!isFormValid) {
      setError("Lütfen tüm alanları doldurun ve yasal metinleri kabul edin.");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    try {
      localStorage.setItem(CART_KEY, JSON.stringify([]));
      window.dispatchEvent(new Event("cart_updated"));
    } catch {}

    router.push("/odeme/basarili");
  };

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>Yükleniyor...</div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <style jsx>{`
        .checkoutGrid {
          margin-top: 28px;
          display: grid;
          gap: 22px;
          align-items: start;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
        }
        @media (max-width: 1024px) {
          .checkoutGrid {
            grid-template-columns: 1fr;
          }
          .stickySummary {
            position: relative !important;
            top: auto !important;
          }
        }

        .grid2 {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 12px;
        }
        @media (max-width: 640px) {
          .grid2 {
            grid-template-columns: 1fr;
          }
        }

        .card {
          min-width: 0;
          overflow: hidden;
        }

        /* ✅ SSL / 3D / Secure band */
        .securityBand {
          margin-top: 14px;
          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: 18px;
          padding: 12px 12px;
          background: rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(10px);
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.35);
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .secLeft {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .badge {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          display: grid;
          place-items: center;
          color: #d4af37;
          background: rgba(0, 0, 0, 0.25);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
          flex: 0 0 auto;
        }
        .secTitle {
          font-weight: 900;
          letter-spacing: 0.3px;
          color: rgba(212, 175, 55, 0.95);
          font-size: 13px;
          text-transform: uppercase;
        }
        .secSub {
          opacity: 0.78;
          font-size: 12px;
          margin-top: 2px;
        }
        .secRight {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pill {
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          padding: 8px 10px;
          font-size: 12px;
          opacity: 0.9;
          background: rgba(255, 255, 255, 0.06);
          white-space: nowrap;
        }

        /* ✅ Micro progress */
        .progressWrap {
          margin-top: 14px;
          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: 18px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(10px);
        }
        .progressTop {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: baseline;
        }
        .progressLabel {
          color: rgba(212, 175, 55, 0.92);
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.2px;
        }
        .progressPct {
          font-weight: 900;
          color: rgba(255, 255, 255, 0.92);
          font-size: 12px;
          opacity: 0.85;
        }
        .bar {
          margin-top: 10px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }
        .bar > div {
          height: 100%;
          width: var(--w);
          background: linear-gradient(
            90deg,
            rgba(212, 175, 55, 0.55),
            rgba(212, 175, 55, 1)
          );
          border-radius: 999px;
          transition: width 420ms cubic-bezier(0.2, 0.9, 0.2, 1);
          box-shadow: 0 10px 28px rgba(212, 175, 55, 0.16);
        }

        /* ✅ Buton soft glow */
        .payBtn {
          position: relative;
          isolation: isolate;
        }
        .payBtn::before {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: 999px;
          background: radial-gradient(
            closest-side,
            rgba(212, 175, 55, 0.25),
            transparent 70%
          );
          opacity: 0;
          filter: blur(10px);
          transition: opacity 180ms ease;
          z-index: -1;
        }
        .payBtn:hover::before {
          opacity: 1;
        }
        .payBtn:active {
          transform: translateY(1px);
        }

        .summaryItemTitle {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ✅ Yasal onay alanı */
        .legalBox {
          margin-top: 14px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.22);
          padding: 12px 12px;
        }
        .legalRow {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 10px 8px;
          border-radius: 14px;
          transition: background 160ms ease;
        }
        .legalRow:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        .legalText {
          font-size: 13px;
          line-height: 1.45;
          opacity: 0.92;
        }
        .policyBtn {
          all: unset;
          cursor: pointer;
          color: #d4af37;
          border-bottom: 1px solid rgba(212, 175, 55, 0.35);
        }
        .policyBtn:hover {
          border-bottom-color: rgba(212, 175, 55, 0.7);
        }
        .legalHint {
          margin-top: 8px;
          font-size: 12px;
          opacity: 0.65;
          padding: 0 8px;
        }

        /* ✅ MODAL */
        .modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.62);
          backdrop-filter: blur(12px);
          z-index: 9999;
          display: grid;
          place-items: center;
          padding: 18px;
        }
        .modalCard {
          width: min(860px, 100%);
          max-height: min(78vh, 760px);
          border-radius: 22px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          background: linear-gradient(
            180deg,
            rgba(14, 8, 18, 0.96),
            rgba(8, 4, 11, 0.92)
          );
          box-shadow: 0 40px 140px rgba(0, 0, 0, 0.65);
          overflow: hidden;
          display: grid;
          grid-template-rows: auto 1fr auto;
        }
        .modalTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .modalTitle {
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.95);
          font-weight: 900;
        }
        .modalClose {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(0, 0, 0, 0.22);
          color: rgba(212, 175, 55, 0.95);
          cursor: pointer;
          display: grid;
          place-items: center;
        }
        .modalBody {
          padding: 14px 16px;
          overflow: auto;
        }
        .modalText {
          white-space: pre-wrap;
          font-size: 13px;
          line-height: 1.75;
          opacity: 0.9;
        }
        .modalBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 14px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.18);
        }
        .modalMeta {
          font-size: 12px;
          opacity: 0.7;
        }
        .acceptBtn {
          border: 1px solid rgba(212, 175, 55, 0.85);
          background: linear-gradient(
            180deg,
            rgba(212, 175, 55, 1),
            rgba(212, 175, 55, 0.82)
          );
          color: rgba(8, 4, 11, 0.96);
          font-weight: 900;
          letter-spacing: 0.2px;
          padding: 12px 16px;
          border-radius: 999px;
          cursor: pointer;
          transition: transform 140ms ease, filter 160ms ease;
          white-space: nowrap;
        }
        .acceptBtn:hover {
          filter: brightness(1.03);
          transform: translateY(-1px);
        }
        .acceptBtn:active {
          transform: translateY(0px) scale(0.99);
        }
      `}</style>

      {/* ✅ MODAL (üstte açılır) */}
      {policyOpen && (
        <div
          className="modalOverlay"
          role="dialog"
          aria-modal="true"
          aria-label={getPolicyTitle(policyKey)}
          onMouseDown={(e) => {
            // overlay tıklanınca kapat
            if (e.target === e.currentTarget) setPolicyOpen(false);
          }}
        >
          <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modalTop">
              <div className="modalTitle">{getPolicyTitle(policyKey)}</div>
              <button className="modalClose" onClick={() => setPolicyOpen(false)} aria-label="Kapat">
                ✕
              </button>
            </div>

            <div className="modalBody">
              <div className="modalText">{getPolicyText(policyKey)}</div>
            </div>

            <div className="modalBottom">
              <div className="modalMeta">
                Okuduktan sonra <b>Kabul Et</b> ile devam edebilirsin.
              </div>
              <button className="acceptBtn" onClick={acceptPolicy}>
                Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={containerStyle}>
        <header
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, color: "#d4af37", fontSize: 40, letterSpacing: 0.4 }}>
              Ödeme
            </h1>
            <p style={{ marginTop: 10, opacity: 0.78 }}>
              Bilgilerini gir, siparişini tamamla.
            </p>

            <div className="securityBand">
              <div className="secLeft">
                <div className="badge">🛡️</div>
                <div style={{ minWidth: 0 }}>
                  <div className="secTitle">Secure Checkout</div>
                  <div className="secSub">SSL şifreleme • 3D Secure • Kart verisi saklanmaz</div>
                </div>
              </div>
              <div className="secRight">
                <span className="pill">SSL</span>
                <span className="pill">3D Secure</span>
                <span className="pill">Secure</span>
              </div>
            </div>

            <div className="progressWrap">
              <div className="progressTop">
                <div className="progressLabel">{progressLabel}</div>
                <div className="progressPct">%{progress}</div>
              </div>
              <div className="bar" aria-hidden>
                <div style={{ ["--w" as any]: `${progress}%` }} />
              </div>
            </div>
          </div>

          <Link
            href="/sepet"
            style={{
              color: "#d4af37",
              textDecoration: "none",
              border: "1px solid rgba(212,175,55,0.35)",
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.25)",
              flex: "0 0 auto",
            }}
          >
            ← Sepete Dön
          </Link>
        </header>

        <section className="checkoutGrid">
          {/* SOL */}
          <div className="card" style={cardStyle}>
            <h2 style={sectionTitle}>Teslimat Bilgileri</h2>

            <div className="grid2">
              <Field label="Ad Soyad">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} placeholder="Örn: DAVİD WALKER" />
              </Field>
              <Field label="Telefon">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="05xx xxx xx xx" />
              </Field>
            </div>

            <Field label="E-posta">
              <input value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="ornek@mail.com" />
            </Field>

            <div className="grid2">
              <Field label="İl">
                <input value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} placeholder="İstanbul" />
              </Field>
              <Field label="İlçe">
                <input value={district} onChange={(e) => setDistrict(e.target.value)} style={inputStyle} placeholder="Kadıköy" />
              </Field>
            </div>

            <Field label="Adres">
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ ...inputStyle, minHeight: 90, resize: "vertical" as const }}
                placeholder="Mahalle, sokak, no, daire..."
              />
            </Field>

            <div style={{ height: 1, background: "rgba(212,175,55,0.18)", margin: "18px 0 22px" }} />

            <h2 style={sectionTitle}>Kart Bilgileri (Demo)</h2>

            <Field label="Kart Üzerindeki İsim">
              <input value={cardName} onChange={(e) => setCardName(e.target.value)} style={inputStyle} placeholder="Örn: David Walker" />
            </Field>

            <Field label="Kart Numarası">
              <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} style={inputStyle} placeholder="0000 0000 0000 0000" />
            </Field>

            <div className="grid2">
              <Field label="SKT (AA/YY)">
                <input value={exp} onChange={(e) => setExp(e.target.value)} style={inputStyle} placeholder="12/28" />
              </Field>
              <Field label="CVC">
                <input value={cvc} onChange={(e) => setCvc(e.target.value)} style={inputStyle} placeholder="123" />
              </Field>
            </div>

            {/* ✅ YASAL ONAYLAR: checkbox + metni modalda aç */}
            <div className="legalBox">
              <label className="legalRow">
                <input type="checkbox" checked={agreeDistance} onChange={(e) => setAgreeDistance(e.target.checked)} style={{ marginTop: 3 }} />
                <span className="legalText">
                  <button type="button" className="policyBtn" onClick={() => openPolicy("distance")}>
                    Mesafeli Satış Sözleşmesi
                  </button>{" "}
                  metnini okudum, kabul ediyorum.
                </span>
              </label>

              <label className="legalRow">
                <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} style={{ marginTop: 3 }} />
                <span className="legalText">
                  <button type="button" className="policyBtn" onClick={() => openPolicy("privacy")}>
                    Gizlilik Politikası
                  </button>{" "}
                  metnini okudum, kabul ediyorum.
                </span>
              </label>

              <label className="legalRow">
                <input type="checkbox" checked={agreeKvkk} onChange={(e) => setAgreeKvkk(e.target.checked)} style={{ marginTop: 3 }} />
                <span className="legalText">
                  <button type="button" className="policyBtn" onClick={() => openPolicy("kvkk")}>
                    KVKK Aydınlatma Metni
                  </button>{" "}
                  kapsamında bilgilendirildim.
                </span>
              </label>

              <div className="legalHint">
                Metinler ödeme sayfası üzerinde açılır. “Kabul Et” ile ilgili onay otomatik işaretlenir.
              </div>
            </div>

            {error && (
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,0,0,0.10)",
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={onPay}
              disabled={!isFormValid || submitting}
              className="payBtn"
              style={{
                marginTop: 18,
                width: "100%",
                padding: 16,
                borderRadius: 999,
                border: "1px solid rgba(212,175,55,0.9)",
                background:
                  !isFormValid || submitting
                    ? "transparent"
                    : "linear-gradient(180deg, rgba(212,175,55,1) 0%, rgba(212,175,55,0.86) 100%)",
                color: !isFormValid || submitting ? "rgba(212,175,55,0.7)" : "#08040b",
                cursor: !isFormValid || submitting ? "not-allowed" : "pointer",
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: 0.2,
                transition: "transform 140ms ease, filter 160ms ease, opacity 200ms ease",
                opacity: submitting ? 0.75 : 1,
              }}
            >
              {submitting ? "İşleniyor..." : `Ödemeyi Tamamla • ${formatTRY(total)}`}
            </button>

            <p style={{ marginTop: 10, opacity: 0.65, fontSize: 12 }}>
              Bu sayfa demo. Gerçek ödeme altyapısı için iyzico/Stripe entegrasyonu ekleyeceğiz.
            </p>
          </div>

          {/* SAĞ */}
          <aside className="card stickySummary" style={{ ...cardStyle, position: "sticky", top: 24 }}>
            <h2 style={sectionTitle}>Sipariş Özeti</h2>

            {cart.length === 0 ? (
              <div style={{ opacity: 0.8, fontSize: 14 }}>
                Sepetin boş görünüyor.{" "}
                <Link href="/magaza" style={{ color: "#d4af37" }}>
                  Mağazaya git
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {cart.map((it) => {
                  const price = Number((it as any).price) || 0;

                  if (isGiftItem(it)) {
                    return (
                      <div
                        key={it.id}
                        style={{
                          border: "1px solid rgba(212,175,55,0.18)",
                          borderRadius: 16,
                          padding: 14,
                          background: "rgba(0,0,0,0.25)",
                          maxWidth: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, minWidth: 0, alignItems: "baseline" }}>
                          <div className="summaryItemTitle" style={{ fontWeight: 900, color: "#d4af37" }}>
                            {it.title || "Hediye Seti"}
                          </div>
                          <div style={{ fontWeight: 900, flex: "0 0 auto" }}>{formatTRY(price)}</div>
                        </div>

                        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.85, lineHeight: 1.6, wordBreak: "break-word" }}>
                          <b>Esanslar:</b>{" "}
                          {Array.isArray(it.essences) && it.essences.length > 0 ? it.essences.join(", ") : "—"}
                          <br />
                          <b>Şişe:</b> {it.bottle?.name || "Sistem seçimi"}
                        </div>
                      </div>
                    );
                  }

                  const p = it as PersonalItem;
                  return (
                    <div
                      key={p.id}
                      style={{
                        border: "1px solid rgba(212,175,55,0.18)",
                        borderRadius: 16,
                        padding: 14,
                        background: "rgba(0,0,0,0.25)",
                        maxWidth: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, minWidth: 0, alignItems: "baseline" }}>
                        <div className="summaryItemTitle" style={{ fontWeight: 900, color: "#d4af37" }}>
                          Kişisel Parfüm
                        </div>
                        <div style={{ fontWeight: 900, flex: "0 0 auto" }}>{formatTRY(price)}</div>
                      </div>

                      <div style={{ marginTop: 8, fontSize: 13, opacity: 0.85, lineHeight: 1.6, wordBreak: "break-word" }}>
                        Üst: {p.topNote} • %{p.ratios?.top ?? 0}
                        <br />
                        Orta: {p.midNote} • %{p.ratios?.mid ?? 0}
                        <br />
                        Alt: {p.baseNote} • %{p.ratios?.base ?? 0}
                        <br />
                        Baz: {p.baseType === "alkol" ? "Alkol" : "Yağ"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ height: 1, background: "rgba(212,175,55,0.18)", margin: "16px 0" }} />

            <Row label="Ara Toplam" value={formatTRY(subtotal)} />
            <Row label="Kargo" value={shipping === 0 ? "Ücretsiz" : formatTRY(shipping)} />
            <Row label="Toplam" value={formatTRY(total)} strong />

            <div style={{ marginTop: 12, opacity: 0.65, fontSize: 12 }}>
              Güvenli ödeme rozeti/SSL ikonlarını bir sonraki adımda “gerçek logo” ile de koyabiliriz.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

/* --- küçük bileşenler --- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 12, minWidth: 0 }}>
      <div style={{ color: "#d4af37", fontSize: 13, marginBottom: 8, opacity: 0.95 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10, minWidth: 0 }}>
      <div style={{ opacity: 0.8, minWidth: 0 }}>{label}</div>
      <div style={{ fontWeight: strong ? 900 : 700, color: strong ? "#d4af37" : "white", flex: "0 0 auto" }}>
        {value}
      </div>
    </div>
  );
}

/* --- stiller --- */

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "60px 24px",
  background: "radial-gradient(1200px 600px at top, #2a0f3f, #09040c)",
  color: "white",
  overflowX: "hidden",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(212,175,55,0.32)",
  borderRadius: 28,
  padding: 22,
  background: "rgba(0,0,0,0.35)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  color: "#d4af37",
  fontSize: 18,
  letterSpacing: 0.4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.16)",
  color: "white",
  outline: "none",
  minWidth: 0,
};
