import useNavigator from "@dashboard/hooks/useNavigator";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { pageListUrl, type PageListUrlQueryParams } from "../urls";

const STORAGE_KEY = "modeling.lastActiveType";
const ALL_SENTINEL = "__ALL__";

const readStoredActiveType = (): { value: string | null; hasValue: boolean } => {
  if (typeof window === "undefined") {
    return { value: null, hasValue: false };
  }

  try {
    const value = localStorage.getItem(STORAGE_KEY);

    if (value === null) {
      return { value: null, hasValue: false };
    }

    if (value === "" || value === ALL_SENTINEL) {
      return { value: null, hasValue: true };
    }

    return { value, hasValue: true };
  } catch {
    return { value: null, hasValue: false };
  }
};

const writeStoredActiveType = (typeId: string | null) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, typeId ?? ALL_SENTINEL);
  } catch {
    // localStorage may be unavailable (e.g. private mode); silently ignore.
  }
};

interface UseActiveModelTypeResult {
  activeType: string | null;
  hasUserChoice: boolean;
  setActive: (typeId: string | null) => void;
}

interface UseActiveModelTypeArgs {
  params: PageListUrlQueryParams;
}

/**
 * Resolves which Model Type the user is currently focused on.
 *
 * Source of truth precedence:
 *  1. `activeType` URL query param (deep-linkable / shareable)
 *  2. `localStorage` value persisted from a previous visit
 *  3. `null` ("All") — first visit; the caller may then choose to navigate to a sensible default.
 *
 * Calling `setActive` updates both the URL and localStorage atomically and resets pagination.
 */
export const useActiveModelType = ({
  params,
}: UseActiveModelTypeArgs): UseActiveModelTypeResult => {
  const navigate = useNavigator();
  // Mirror localStorage in component state so that subsequent writes (including
  // setActive(null) which means "All") immediately reflect in the value we read.
  // Reading from `localStorage` directly during render is forbidden as a side effect,
  // and reading once via `useState` lazy init would freeze the snapshot — leaving the
  // stale type in place when the user later clicks "All".
  const [stored, setStored] = useState(readStoredActiveType);

  const urlActiveType = params.activeType ?? null;
  const activeType = urlActiveType ?? stored.value;
  const hasUserChoice = urlActiveType !== null || stored.hasValue;

  // Keep localStorage in sync if the URL changes via deep-link / browser nav.
  useEffect(
    function syncUrlToLocalStorage() {
      if (urlActiveType !== null) {
        writeStoredActiveType(urlActiveType);
        setStored({ value: urlActiveType, hasValue: true });
      }
    },
    [urlActiveType],
  );

  // Latest-params ref keeps `setActive` referentially stable across URL changes.
  // Without this, every URL update re-creates the callback, which would re-fire any
  // dependent effects (e.g. the first-visit-default effect in PageList) on every
  // navigation tick — wasted work and a footgun for callers who treat `setActive`
  // as a stable identity.
  const paramsRef = useRef(params);

  useEffect(
    function trackLatestParams() {
      paramsRef.current = params;
    },
    [params],
  );

  const setActive = useCallback(
    (typeId: string | null) => {
      writeStoredActiveType(typeId);
      setStored({ value: typeId, hasValue: true });

      // Reset pagination + bulk selection when changing tabs.
      const next: PageListUrlQueryParams = {
        ...paramsRef.current,
        activeType: typeId ?? undefined,
        after: undefined,
        before: undefined,
        ids: undefined,
        action: undefined,
      };

      navigate(pageListUrl(next));
    },
    [navigate],
  );

  return useMemo(
    () => ({
      activeType,
      hasUserChoice,
      setActive,
    }),
    [activeType, hasUserChoice, setActive],
  );
};
