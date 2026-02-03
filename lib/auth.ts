import crypto from "crypto";

export const SESSION_COOKIE_NAME = "session";

// ✅ Localhost için kritik: production değilse secure=false
export function cookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

type SessionPayload = {
  id: string;
  email: string;
  iat?: number;
};

function getSecret() {
  return process.env.AUTH_SECRET || "CHANGE_ME_USE_A_LONG_RANDOM_STRING";
}

// Basit token: base64(payload).HMAC
export function createSessionToken(payload: SessionPayload) {
  const secret = getSecret();
  const fullPayload: SessionPayload = { ...payload, iat: Date.now() };

  const json = JSON.stringify(fullPayload);
  const b64 = Buffer.from(json, "utf8").toString("base64url");

  const sig = crypto.createHmac("sha256", secret).update(b64).digest("base64url");

  return `${b64}.${sig}`;
}

// (İstersen me route için) token doğrulama
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const secret = getSecret();
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return null;

    const expected = crypto.createHmac("sha256", secret).update(b64).digest("base64url");
    if (!timingSafeEqual(sig, expected)) return null;

    const json = Buffer.from(b64, "base64url").toString("utf8");
    return JSON.parse(json) as SessionPayload;
  } catch {
    return null;
  }
}

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}
