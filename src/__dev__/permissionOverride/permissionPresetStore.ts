// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { type PermissionEnum } from "@dashboard/graphql";

const STORAGE_KEY = "dev:permissionPresets";
const EVENT_NAME = "dev:permissionPresets:change";
const MAX_PRESETS = 20;

export interface PermissionPreset {
  hash: string;
  name: string;
  permissions: PermissionEnum[];
  savedAt: string;
}

const readAll = (): PermissionPreset[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as PermissionPreset[]) : [];
  } catch {
    return [];
  }
};

const sortPresets = (presets: PermissionPreset[]): PermissionPreset[] =>
  [...presets].sort((left, right) => right.savedAt.localeCompare(left.savedAt));

let cachedSnapshot = sortPresets(readAll());

const notify = (): void => {
  cachedSnapshot = sortPresets(readAll());
  window.dispatchEvent(new Event(EVENT_NAME));
};

const writeAll = (presets: PermissionPreset[]): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  notify();
};

export const permissionPresetStore = {
  getSnapshot: (): PermissionPreset[] => cachedSnapshot,

  subscribe: (listener: () => void): (() => void) => {
    const handler = (): void => listener();

    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("storage", handler);
    };
  },

  getAll: (): PermissionPreset[] => cachedSnapshot,

  getByHash: (hash: string): PermissionPreset | null =>
    cachedSnapshot.find(preset => preset.hash === hash) ?? null,

  upsert: (preset: PermissionPreset): boolean => {
    if (permissionPresetStore.getByHash(preset.hash)) {
      return false;
    }

    const others = readAll().filter(existing => existing.hash !== preset.hash);
    const next = [preset, ...others].slice(0, MAX_PRESETS);

    writeAll(next);

    return true;
  },

  remove: (hash: string): void => {
    writeAll(readAll().filter(preset => preset.hash !== hash));
  },
};
