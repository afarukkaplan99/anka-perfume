import fs from "fs";
import path from "path";
import crypto from "crypto";

export type StoredUser = {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]", "utf8");
}

export function readUsers(): StoredUser[] {
  ensureStore();
  const raw = fs.readFileSync(USERS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

export function writeUsers(users: StoredUser[]) {
  ensureStore();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export function findUserByEmail(email: string) {
  const users = readUsers();
  const e = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === e) || null;
}

export function createUser(opts: {
  email: string;
  password: string;
  name?: string;
}) {
  const email = opts.email.trim().toLowerCase();
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("EMAIL_IN_USE");
  }

  const id = crypto.randomBytes(16).toString("hex");
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = pbkdf2Hash(opts.password, salt);

  const user: StoredUser = {
    id,
    email,
    name: opts.name?.trim() || undefined,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);
  return { id: user.id, email: user.email, name: user.name };
}

export function verifyPassword(user: StoredUser, password: string) {
  const hash = pbkdf2Hash(password, user.passwordSalt);
  const a = Buffer.from(hash);
  const b = Buffer.from(user.passwordHash);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function pbkdf2Hash(password: string, saltHex: string) {
  const salt = Buffer.from(saltHex, "hex");
  const derived = crypto.pbkdf2Sync(password, salt, 120_000, 32, "sha256");
  return derived.toString("hex");
}
