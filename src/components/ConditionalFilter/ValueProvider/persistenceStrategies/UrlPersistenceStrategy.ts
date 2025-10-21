import { FilterContainer } from "../../FilterElement";
import { PersistenceStrategy } from "../FilterValueController";

export interface UrlPersistenceStrategyConfig {
  /**
   * The router history object for URL manipulation.
   * Should be compatible with react-router's history API.
   */
  history: {
    replace: (location: { pathname: string; search?: string }) => void;
  };

  /**
   * Current location information from the router.
   */
  location: {
    pathname: string;
    search: string;
  };

  /**
   * Additional query parameters to preserve during filter persistence.
   * These params are merged with filter state when updating the URL.
   *
   * For example:
   * - query: Search query
   * - before: Pagination cursor
   * - after: Pagination cursor
   * etc.
   */
  preservedParams?: Record<string, string | undefined>;
}

/**
 * TODO:
 * - Wrap router.history.replace calls from useUrlValueProvider
 * - Handle URL query parameter serialization using prepareStructure utility
 * - Preserve additional params (activeTab, query, before, after)
 * - Ensure FilterContainer format compatibility
 */
export class UrlPersistenceStrategy implements PersistenceStrategy {
  constructor(private config: UrlPersistenceStrategyConfig) {}

  persist(_value: FilterContainer): void {
    throw new Error("UrlPersistenceStrategy.persist: Not implemented yet");
  }

  clear(): void {
    throw new Error("UrlPersistenceStrategy.clear: Not implemented yet");
  }
}
