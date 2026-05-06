import { useCallback, useState } from "react";

const STORAGE_KEY = "modeling.pinnedModelTypes";

const readPinned = (): string[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Defensive: only keep string entries; tolerate accidental writes of
    // other shapes from older versions or hand-edited storage.
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
};

const writePinned = (typeIds: string[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(typeIds));
  } catch {
    // localStorage unavailable (private mode, quota exceeded); silently ignore.
  }
};

interface UsePinnedModelTypesResult {
  /** Pinned Model Type ids in insertion order — most recently pinned at the end. */
  pinnedTypeIds: string[];
  /** Toggle pin state for a single id. Pins to the end of the list (newest last). */
  togglePin: (typeId: string) => void;
  /** True iff the given id is currently pinned. */
  isPinned: (typeId: string) => boolean;
}

/**
 * Lets the user "pin" Model Types so they always appear at the front of the
 * tab strip, right after "All". Pin order is insertion order (newest pin
 * appended), matching the convention of browser bookmarks and Slack channels.
 *
 * Persisted to localStorage so the choice survives page reloads.
 */
export const usePinnedModelTypes = (): UsePinnedModelTypesResult => {
  const [pinnedTypeIds, setPinnedTypeIds] = useState<string[]>(readPinned);
  const togglePin = useCallback((typeId: string) => {
    setPinnedTypeIds(current => {
      const next = current.includes(typeId)
        ? current.filter(id => id !== typeId)
        : [...current, typeId];

      writePinned(next);

      return next;
    });
  }, []);
  const isPinned = useCallback((typeId: string) => pinnedTypeIds.includes(typeId), [pinnedTypeIds]);

  return { pinnedTypeIds, togglePin, isPinned };
};
