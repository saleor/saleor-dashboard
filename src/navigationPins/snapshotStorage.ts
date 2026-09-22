import { type NavigationPin } from "./types";

const ORGANIZATION_PINS_KEY = "dashboard-navigation-pins-snapshot:organization";
const MODEL_TYPE_NAMES_KEY = "dashboard-navigation-pins-snapshot:names";

/**
 * Same trick as `extensionsSnapshotStorage`: keep the last known good payload in localStorage
 * so the sidebar paints pins on the first frame instead of after the network settles.
 * Storage may be unavailable (quota, privacy mode) — every path degrades silently.
 */
const read = <T>(key: string, isValid: (value: unknown) => value is T): T | null => {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore — a missing snapshot only costs a frame.
  }
};

const isPinArray = (value: unknown): value is NavigationPin[] => Array.isArray(value);

const isNameMap = (value: unknown): value is Record<string, string> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const readOrganizationPinsSnapshot = () => read(ORGANIZATION_PINS_KEY, isPinArray);

export const writeOrganizationPinsSnapshot = (pins: NavigationPin[]) =>
  write(ORGANIZATION_PINS_KEY, pins);

export const readModelTypeNamesSnapshot = () => read(MODEL_TYPE_NAMES_KEY, isNameMap);

export const writeModelTypeNamesSnapshot = (names: Record<string, string>) =>
  write(MODEL_TYPE_NAMES_KEY, names);
