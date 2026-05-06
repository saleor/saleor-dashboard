import { useCallback, useState } from "react";

const STORAGE_KEY = "modeling.lastUsedModelTypeForCreate";

const readLastUsed = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const writeLastUsed = (typeId: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, typeId);
  } catch {
    // localStorage unavailable; silently ignore.
  }
};

interface UseLastUsedModelTypeResult {
  /** The Model Type id the user most recently created an entry with, or `null` if none. */
  lastUsedTypeId: string | null;
  /** Persist the latest user choice. Call after the user confirms the picker. */
  rememberLastUsed: (typeId: string) => void;
}

/**
 * Persists the Model Type the user picked the last time they hit "Create model".
 * Used to default the picker when the user is on the "All" tab and there's no
 * stronger contextual signal (e.g., active type tab).
 */
export const useLastUsedModelType = (): UseLastUsedModelTypeResult => {
  const [lastUsedTypeId, setLastUsedTypeId] = useState<string | null>(readLastUsed);
  const rememberLastUsed = useCallback((typeId: string) => {
    writeLastUsed(typeId);
    setLastUsedTypeId(typeId);
  }, []);

  return { lastUsedTypeId, rememberLastUsed };
};
