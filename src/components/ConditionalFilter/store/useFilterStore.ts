import { useEffect, useMemo, useSyncExternalStore } from "react";
import useRouter from "use-react-router";

import { history } from "../../Router";
import { FilterContainer } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { FilterProviderType, InitialAPIState } from "../types";
import { createFilterStore, FilterStore, FilterStoreConfig } from "./FilterStore";

/**
 * Hook to consume filter value from a FilterStore using useSyncExternalStore.
 * This provides synchronous, tear-free reads from the URL.
 */
export function useFilterValue(store: FilterStore): FilterContainer {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot, // Server snapshot (same for client-only app)
  );
}

/**
 * Hook to get loading state from a FilterStore.
 * Uses useSyncExternalStore for consistency.
 */
export function useFilterLoading(store: FilterStore): boolean {
  return useSyncExternalStore(store.subscribe, store.getLoading, store.getLoading);
}

/**
 * Hook to get filter count from a FilterStore.
 */
export function useFilterCount(store: FilterStore): number {
  return useSyncExternalStore(store.subscribe, store.getCount, store.getCount);
}

/**
 * Hook to create a FilterValueProvider interface from a FilterStore.
 * This provides backward compatibility with existing code.
 *
 * Note: This returns a stable object reference that updates its getters
 * when the store changes, avoiding unnecessary re-renders.
 */
export function useFilterValueProvider(store: FilterStore): FilterValueProvider {
  // Read values via useSyncExternalStore for synchronous updates
  const value = useFilterValue(store);
  const loading = useFilterLoading(store);
  const count = useFilterCount(store);

  // Return stable object with current values
  // Using useMemo to prevent new object creation on every render
  return useMemo(
    () => ({
      value,
      loading,
      count,
      persist: store.persist,
      clear: store.clear,
      isPersisted: store.isPersisted,
      getTokenByName: store.getTokenByName,
    }),
    [value, loading, count, store],
  );
}

export interface UseFilterStoreOptions {
  /** Filter provider type (product, order, etc.) */
  type: FilterProviderType;

  /** Initial state API for data hydration (optional) */
  initialState?: InitialAPIState;

  /** URL params to preserve during persist */
  preservedParams?: string[];
}

/**
 * Hook to create and manage a FilterStore.
 *
 * This is the main hook for creating a filter store tied to the current URL.
 * It handles:
 * - Creating the store with proper history/location
 * - Triggering initial data fetch when URL changes
 * - Cleaning up the store on unmount
 *
 * @returns The FilterStore instance and derived FilterValueProvider
 */
export function useFilterStore(options: UseFilterStoreOptions): {
  store: FilterStore;
  valueProvider: FilterValueProvider;
} {
  const router = useRouter();
  const { type, initialState, preservedParams } = options;

  // Create store - stable reference unless config changes
  const store = useMemo(
    () =>
      createFilterStore({
        history,
        location: router.location,
        type,
        initialState,
        preservedParams,
      }),
    // Note: We use the singleton history, not router.history
    // Location is used for initial value, updates come via history.listen
    [type, initialState, preservedParams],
  );

  // Cleanup store on unmount
  useEffect(() => {
    return () => {
      store.dispose();
    };
  }, [store]);

  // Trigger initial data fetch when URL changes
  // This replaces the useEffect in useUrlValueProvider that triggers fetchQueries
  useEffect(() => {
    if (!initialState) {
      return;
    }

    const fetchingParams = store.getFetchingParams();

    if (fetchingParams) {
      // The initialState.fetchQueries expects specific param types per domain
      // We rely on the existing type system from InitialAPIState
      (initialState as any).fetchQueries(fetchingParams);
    }
  }, [router.location.search, initialState, store]);

  // Create FilterValueProvider interface for backward compatibility
  const valueProvider = useFilterValueProvider(store);

  return { store, valueProvider };
}

/**
 * Hook specifically for modal filters that need to read from current URL
 * and preserve modal-specific params (action, ids, etc.)
 */
export function useModalFilterStore(options: Omit<UseFilterStoreOptions, "preservedParams">): {
  store: FilterStore;
  valueProvider: FilterValueProvider;
} {
  return useFilterStore({
    ...options,
    // Modal-specific preserved params
    preservedParams: ["action", "ids", "activeTab", "query", "before", "after", "asc", "sort"],
  });
}

/**
 * Factory function to create a store outside of React (useful for testing).
 * Prefer useFilterStore for components.
 */
export function createFilterStoreFromConfig(
  config: Omit<FilterStoreConfig, "history" | "location">,
): FilterStore {
  return createFilterStore({
    ...config,
    history,
    location: history.location,
  });
}
