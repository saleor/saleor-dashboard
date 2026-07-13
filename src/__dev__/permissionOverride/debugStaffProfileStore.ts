// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
//
// Stores debug staff profile metadata (email, permissions hash) for quick re-login.
// Passwords are not stored — rely on the browser password manager instead.
import { type PermissionEnum } from "@dashboard/graphql";

const STORAGE_KEY = "dev:debugStaffProfiles";
const EVENT_NAME = "dev:debugStaffProfiles:change";
const MAX_PROFILES_PER_BASE_EMAIL = 8;

export interface DebugStaffProfile {
  baseEmail: string;
  debugEmail: string;
  hash: string;
  permissions: PermissionEnum[];
  staffCreated: boolean;
  lastUsedAt: string;
}

const readAll = (): DebugStaffProfile[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as DebugStaffProfile[]) : [];
  } catch {
    return [];
  }
};

let cachedSnapshot = readAll();

const notify = (): void => {
  cachedSnapshot = readAll();
  window.dispatchEvent(new Event(EVENT_NAME));
};

const writeAll = (profiles: DebugStaffProfile[]): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  notify();
};

export const debugStaffProfileStore = {
  getSnapshot: (): DebugStaffProfile[] => cachedSnapshot,

  subscribe: (listener: () => void): (() => void) => {
    const handler = (): void => listener();

    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("storage", handler);
    };
  },

  getForBaseEmail: (baseEmail: string): DebugStaffProfile[] =>
    cachedSnapshot
      .filter(profile => profile.baseEmail === baseEmail)
      .sort((left, right) => right.lastUsedAt.localeCompare(left.lastUsedAt)),

  getByDebugEmail: (debugEmail: string): DebugStaffProfile | null =>
    cachedSnapshot.find(profile => profile.debugEmail === debugEmail) ?? null,

  getByHash: (baseEmail: string, hash: string): DebugStaffProfile | null =>
    cachedSnapshot.find(profile => profile.baseEmail === baseEmail && profile.hash === hash) ??
    null,

  upsert: (profile: DebugStaffProfile): DebugStaffProfile => {
    const others = readAll().filter(
      existing => !(existing.baseEmail === profile.baseEmail && existing.hash === profile.hash),
    );
    const sameBase = others
      .filter(existing => existing.baseEmail === profile.baseEmail)
      .sort((left, right) => right.lastUsedAt.localeCompare(left.lastUsedAt))
      .slice(0, MAX_PROFILES_PER_BASE_EMAIL - 1);

    const rest = others.filter(existing => existing.baseEmail !== profile.baseEmail);
    const saved = { ...profile, lastUsedAt: profile.lastUsedAt || new Date().toISOString() };

    writeAll([saved, ...sameBase, ...rest]);

    return saved;
  },

  remove: (baseEmail: string, hash: string): void => {
    writeAll(
      readAll().filter(profile => !(profile.baseEmail === baseEmail && profile.hash === hash)),
    );
  },
};
