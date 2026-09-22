import { getPinTarget, MAX_PINS_PER_TARGET, NAVIGATION_PINS_METADATA_KEY } from "./constants";
import { type NavigationPin } from "./types";

interface MetadataItem {
  key: string;
  value: string;
}

const isPin = (value: unknown): value is NavigationPin =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as NavigationPin).id === "string" &&
  typeof (value as NavigationPin).target === "string";

/**
 * Metadata is user-writable through the API, so treat every stored value as untrusted:
 * anything malformed degrades to "no pins" rather than breaking the sidebar.
 */
export const parseNavigationPins = (
  metadata: readonly MetadataItem[] | undefined,
): NavigationPin[] => {
  const raw = metadata?.find(item => item.key === NAVIGATION_PINS_METADATA_KEY)?.value;

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(isPin)
      .filter(pin => getPinTarget(pin.target) !== undefined)
      .map(({ id, target }) => ({ id, target }));
  } catch {
    return [];
  }
};

export const serializeNavigationPins = (pins: NavigationPin[]): string => JSON.stringify(pins);

const countPinsForTarget = (pins: NavigationPin[], target: string): number =>
  pins.filter(pin => pin.target === target).length;

export const isPinned = (pins: NavigationPin[], id: string): boolean =>
  pins.some(pin => pin.id === id);

export const isTargetFull = (pins: NavigationPin[], target: string): boolean =>
  countPinsForTarget(pins, target) >= MAX_PINS_PER_TARGET;

/** Appending keeps insertion order, which is the order pins render in. */
export const addPin = (pins: NavigationPin[], pin: NavigationPin): NavigationPin[] => {
  if (isTargetFull(pins, pin.target)) {
    return pins;
  }

  if (pins.some(existing => existing.id === pin.id && existing.target === pin.target)) {
    return pins;
  }

  return [...pins, pin];
};

export const removePin = (pins: NavigationPin[], pin: NavigationPin): NavigationPin[] =>
  pins.filter(existing => !(existing.id === pin.id && existing.target === pin.target));

export const removePinsById = (pins: NavigationPin[], id: string): NavigationPin[] =>
  pins.filter(existing => existing.id !== id);
