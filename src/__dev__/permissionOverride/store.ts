// DEV-ONLY-PERMISSION-OVERRIDE: temporary tool for testing customer
// read-only access. Remove this entire `__dev__/permissionOverride/` folder
// (and the override block in src/auth/useUser.ts, permissionOverrideBinding
// files, vite alias, and the mount in src/index.tsx) before pushing upstream.
// Enabled locally with VITE_ENABLE_PERMISSIONS_DEBUGGER=true (dev server only).
//
// Quick removal:
//   git grep -l "DEV-ONLY-PERMISSION-OVERRIDE"
//
// The store is a thin localStorage-backed observable so `useSyncExternalStore`
// can re-render permission consumers when the developer toggles a checkbox.
import { PermissionEnum } from "@dashboard/graphql";

const STORAGE_KEY = "dev:permissionOverride";
const EVENT_NAME = "dev:permissionOverride:change";

const isPermissionEnum = (value: string): value is PermissionEnum =>
  Object.values(PermissionEnum).includes(value as PermissionEnum);

const readFromStorage = (): PermissionEnum[] | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.filter(
      (value): value is PermissionEnum => typeof value === "string" && isPermissionEnum(value),
    );
  } catch {
    return null;
  }
};

let cachedSnapshot: PermissionEnum[] | null = readFromStorage();

const notify = () => {
  cachedSnapshot = readFromStorage();
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const permissionOverrideStore = {
  getSnapshot: (): PermissionEnum[] | null => cachedSnapshot,
  subscribe: (listener: () => void): (() => void) => {
    const handler = () => listener();

    window.addEventListener(EVENT_NAME, handler);
    // Cross-tab sync: localStorage events fire in *other* tabs only.
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("storage", handler);
    };
  },
  setOverride: (permissions: PermissionEnum[]) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
    notify();
  },
  clearOverride: () => {
    window.localStorage.removeItem(STORAGE_KEY);
    notify();
  },
};
