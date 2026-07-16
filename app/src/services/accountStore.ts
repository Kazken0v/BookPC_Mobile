import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { User } from "../data/mockUser";

const ACCOUNTS_KEY = "cofou.accounts.v1";
const SESSION_KEY = "cofou.session.v1";

type AccountRecord = User & { salt: string; passwordHash: string };

export type RegisterInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

function uuid(): string {
  if (typeof Crypto.randomUUID === "function") return Crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function defaultProfile(name: string, email: string, phone?: string): User {
  return {
    id: uuid(),
    name: name.trim() || email.split("@")[0],
    email,
    phone: phone?.trim() ?? "",
    avatarUrl: "",
    level: 1,
    bonusPoints: 0,
    pointsToNextLevel: 1000,
    totalBookings: 0,
    totalHours: 0,
    favoriteClub: "—",
    memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    rank: "Bronze",
  };
}

async function readAccounts(): Promise<AccountRecord[]> {
  const raw = await SecureStore.getItemAsync(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAccounts(accounts: AccountRecord[]): Promise<void> {
  await SecureStore.setItemAsync(ACCOUNTS_KEY, JSON.stringify(accounts));
}

async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

export async function register(input: RegisterInput): Promise<User> {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password) throw new Error("Email и пароль обязательны");
  if (input.password.length < 6) throw new Error("Пароль минимум 6 символов");

  const accounts = await readAccounts();
  if (accounts.some((a) => a.email === email)) {
    throw new Error("Аккаунт с таким email уже существует");
  }

  const salt = uuid();
  const passwordHash = await hashPassword(input.password, salt);
  const user = defaultProfile(input.name, email, input.phone);
  const record: AccountRecord = { ...user, salt, passwordHash };

  accounts.push(record);
  await writeAccounts(accounts);

  const sessionUser = toSessionUser(record);
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export async function login(emailInput: string, password: string): Promise<User> {
  const email = emailInput.trim().toLowerCase();
  const accounts = await readAccounts();
  const account = accounts.find((a) => a.email === email);
  if (!account) throw new Error("Аккаунт не найден");

  const hash = await hashPassword(password, account.salt);
  if (hash !== account.passwordHash) throw new Error("Неверный пароль");

  const sessionUser = toSessionUser(account);
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function getSession(): Promise<User | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function toSessionUser(record: AccountRecord): User {
  const { salt, passwordHash, ...user } = record;
  return user;
}
