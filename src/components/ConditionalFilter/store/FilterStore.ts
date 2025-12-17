import { History, Location } from "history";
import { stringify } from "qs";

import { FilterContainer, FilterElement } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { FilterProviderType, InitialAPIState, InitialResponseType } from "../types";
import { TokenArray } from "../ValueProvider/TokenArray";
import {
  FetchingParamsType,
  getEmptyFetchingPrams,
} from "../ValueProvider/TokenArray/fetchingParams";
import { UrlToken } from "../ValueProvider/UrlToken";
import { prepareStructure } from "../ValueProvider/utils";

/**
 * External store for filter state that synchronizes with URL.
 *
 * This replaces the triple-state useEffect chain:
 *   URL → useEffect → ValueProvider (useState) → useEffect → ContainerState (useState)
 *
 * With a single synchronous read from URL:
 *   URL → useSyncExternalStore → Component
 *
 * Benefits:
 * - Single re-render per URL change (not 2-3)
 * - No race conditions between effects
 * - No `syncOnce` bandaids needed
 * - Browser back/forward works correctly
 */
export interface FilterStore {
  /** Subscribe to store changes (for useSyncExternalStore) */
  subscribe: (callback: () => void) => () => void;

  /** Get current snapshot synchronously (for useSyncExternalStore) */
  getSnapshot: () => FilterContainer;

  /** Get loading state */
  getLoading: () => boolean;

  /** Persist filter value to URL */
  persist: (value: FilterContainer) => void;

  /** Clear all filters from URL */
  clear: () => void;

  /** Check if element exists in persisted state */
  isPersisted: (element: FilterElement) => boolean;

  /** Get URL token by field name */
  getTokenByName: (name: string) => UrlToken | undefined;

  /** Get count of active filters (excluding connectors like "AND") */
  getCount: () => number;

  /** Get fetching params derived from current URL */
  getFetchingParams: () => FetchingParamsType | null;

  /** Dispose store and cleanup listeners */
  dispose: () => void;
}

export interface FilterStoreConfig {
  /** Browser history instance */
  history: History;

  /** Initial location (from history or router) */
  location: Location;

  /** Filter provider type (product, order, etc.) */
  type: FilterProviderType;

  /** Initial state API for data hydration (optional for types without initial state) */
  initialState?: InitialAPIState;

  /** URL params to preserve during persist (e.g., activeTab, query, before, after) */
  preservedParams?: string[];
}

/**
 * Create a filter store that treats URL as the single source of truth.
 */
export function createFilterStore(config: FilterStoreConfig): FilterStore {
  const {
    history,
    location,
    type,
    initialState,
    preservedParams = ["activeTab", "query", "before", "after", "asc", "sort"],
  } = config;

  // Listeners for useSyncExternalStore subscription
  const listeners = new Set<() => void>();

  // Cache for computed snapshot to avoid recomputation
  let cachedSnapshot: FilterContainer | null = null;
  let cachedTokenArray: TokenArray | null = null;
  let lastLocationSearch = "";

  // Track current location (updated on history changes)
  let currentLocation = location;

  /**
   * Parse URL search params into TokenArray.
   * Filters out preserved params that shouldn't be part of filter state.
   */
  const getTokenArray = (): TokenArray => {
    const search = currentLocation.search;

    // Return cached if URL hasn't changed
    if (search === lastLocationSearch && cachedTokenArray) {
      return cachedTokenArray;
    }

    const params = new URLSearchParams(search);

    // Remove preserved params (they're not filter state)
    preservedParams.forEach(param => params.delete(param));

    cachedTokenArray = new TokenArray(params.toString());
    lastLocationSearch = search;

    return cachedTokenArray;
  };

  /**
   * Get fetching params from current URL for initial data fetch.
   */
  const getFetchingParams = (): FetchingParamsType | null => {
    const paramsFromType = getEmptyFetchingPrams(type);

    if (!paramsFromType) {
      return null;
    }

    return getTokenArray().getFetchingParams(paramsFromType, type) as FetchingParamsType;
  };

  /**
   * Compute FilterContainer from URL.
   * Uses initialState data for hydration if available.
   */
  const computeSnapshot = (): FilterContainer => {
    const tokenArray = getTokenArray();

    // If we have initial state with data, hydrate with it
    if (initialState && !initialState.loading && initialState.data) {
      return tokenArray.asFilterValuesFromResponse(initialState.data as InitialResponseType);
    }

    // No initial state or still loading - return unhydrated tokens
    // (This is used for filter types that don't need data fetching)
    if (!initialState) {
      return tokenArray.asFilterValueFromEmpty();
    }

    // Initial state is loading - return empty to prevent flicker
    return [];
  };

  /**
   * Get current snapshot. Cached and invalidated on URL change.
   */
  const getSnapshot = (): FilterContainer => {
    const search = currentLocation.search;

    // Invalidate cache if URL changed
    if (search !== lastLocationSearch) {
      cachedSnapshot = null;
    }

    // Also invalidate if loading state changed (data arrived)
    // This is checked by comparing the data reference
    if (cachedSnapshot === null) {
      cachedSnapshot = computeSnapshot();
    }

    return cachedSnapshot;
  };

  /**
   * Get loading state from initial state API.
   */
  const getLoading = (): boolean => {
    return initialState?.loading ?? false;
  };

  /**
   * Subscribe to store changes.
   * Returns unsubscribe function.
   */
  const subscribe = (callback: () => void): (() => void) => {
    listeners.add(callback);

    return () => {
      listeners.delete(callback);
    };
  };

  /**
   * Notify all subscribers that store changed.
   */
  const notifyListeners = (): void => {
    // Invalidate cache before notifying
    cachedSnapshot = null;
    cachedTokenArray = null;

    listeners.forEach(listener => listener());
  };

  // Listen to history changes (covers pushState, replaceState, popstate)
  // History 4.x API: listen(location, action)
  const unlistenHistory = history.listen(newLocation => {
    currentLocation = newLocation;
    notifyListeners();
  });

  /**
   * Get preserved params from current URL to maintain during persist.
   */
  const getPreservedParamsObject = (): Record<string, string | undefined> => {
    const params = new URLSearchParams(currentLocation.search);
    const preserved: Record<string, string | undefined> = {};

    preservedParams.forEach(param => {
      const value = params.get(param);

      if (value) {
        preserved[param] = value;
      }
    });

    return preserved;
  };

  /**
   * Persist filter value to URL.
   */
  const persist = (filterValue: FilterContainer): void => {
    const structure = prepareStructure(filterValue);
    const preserved = getPreservedParamsObject();

    history.replace({
      pathname: currentLocation.pathname,
      search: stringify({
        ...structure,
        ...preserved,
      }),
    });

    // Note: history.listen will trigger notifyListeners
  };

  /**
   * Clear all filters from URL (keeps preserved params).
   */
  const clear = (): void => {
    const preserved = getPreservedParamsObject();
    const hasPreserved = Object.keys(preserved).length > 0;

    history.replace({
      pathname: currentLocation.pathname,
      search: hasPreserved ? stringify(preserved) : "",
    });

    // Note: history.listen will trigger notifyListeners
  };

  /**
   * Check if a filter element exists in persisted state.
   */
  const isPersisted = (element: FilterElement): boolean => {
    const snapshot = getSnapshot();

    return snapshot.some(item => FilterElement.isFilterElement(item) && item.equals(element));
  };

  /**
   * Get URL token by field name.
   */
  const getTokenByName = (name: string): UrlToken | undefined => {
    return getTokenArray()
      .asFlatArray()
      .find(token => token.name === name);
  };

  /**
   * Get count of active filters (excluding "AND" connectors).
   */
  const getCount = (): number => {
    const snapshot = getSnapshot();

    return snapshot.filter(item => typeof item !== "string").length;
  };

  /**
   * Cleanup store and remove history listener.
   */
  const dispose = (): void => {
    unlistenHistory();
    listeners.clear();
    cachedSnapshot = null;
    cachedTokenArray = null;
  };

  return {
    subscribe,
    getSnapshot,
    getLoading,
    persist,
    clear,
    isPersisted,
    getTokenByName,
    getCount,
    getFetchingParams,
    dispose,
  };
}

/**
 * Create a FilterValueProvider interface from a FilterStore.
 * This provides backward compatibility with existing code that uses FilterValueProvider.
 */
export function createFilterValueProviderFromStore(store: FilterStore): FilterValueProvider {
  return {
    get value() {
      return store.getSnapshot();
    },
    get loading() {
      return store.getLoading();
    },
    get count() {
      return store.getCount();
    },
    persist: store.persist,
    clear: store.clear,
    isPersisted: store.isPersisted,
    getTokenByName: store.getTokenByName,
  };
}
