// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
//
// Short-lived invite tokens from staff onboarding emails. Dev convenience only.
const STORAGE_KEY = "dev:debugStaffInviteTokens";

type InviteTokenMap = Record<string, string>;

const readAll = (): InviteTokenMap => {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);

    return typeof parsed === "object" && parsed !== null ? (parsed as InviteTokenMap) : {};
  } catch {
    return {};
  }
};

export const debugStaffInviteTokenStore = {
  get: (debugEmail: string): string | null => readAll()[debugEmail] ?? null,
  set: (debugEmail: string, token: string) => {
    const next = { ...readAll(), [debugEmail]: token };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },
  clear: (debugEmail: string) => {
    const { [debugEmail]: _removed, ...rest } = readAll();

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  },
};
