import { FilterContainer, FilterElement } from "../FilterElement";
import { UrlToken } from "./UrlToken";

/**
 * PersistenceStrategy defines the contract for persisting and clearing filter state.
 *
 * Implementations:
 * - UrlPersistenceStrategy: stores state in URL query parameters (for list pages)
 * - InMemoryPersistenceStrategy: stores state in React component state (for modals)
 *
 * @see {@link ./strategies/UrlPersistenceStrategy.ts}
 * @see {@link ./strategies/InMemoryPersistenceStrategy.ts}
 */
export interface PersistenceStrategy {
  /**
   * Persist the filter state to the underlying storage mechanism.
   * @param value The filter container to persist
   */
  persist(value: FilterContainer): void;

  /**
   * Clear all persisted filter state from the underlying storage mechanism.
   */
  clear(): void;
}

export interface FilterValueControllerConfig {
  persistenceStrategy: PersistenceStrategy;

  /**
   * Initial filter state to populate the controller with.
   * If not provided, controller starts with an empty state
   */
  initialValue?: FilterContainer;

  initialLoading?: boolean;

  /**
   * Callback invoked when the filter value changes.
   * Can be used to trigger side effects like data fetching.
   */
  onChange?: (value: FilterContainer) => void;
}

/**
 * FilterValueController is used for managing filter state with different strategies (URL, in-memory)
 *
 * This interface matches FilterValueProvider to ensure backward compatibility
 * with existing code that uses useUrlValueProvider.
 */
export interface FilterValueController {
  readonly value: FilterContainer;

  readonly loading: boolean;

  /**
   * Persist a new filter value using the configured persistence strategy.
   * @param newValue The new filter container to persist
   */
  persist(newValue: FilterContainer): void;

  /**
   * Check if a specific filter element is present in the current state.
   * @param element The filter element to check
   */
  isPersisted(element: FilterElement): boolean;

  /**
   * Clear all filters using the configured persistence strategy.
   */
  clear(): void;

  /**
   * Get a specific token by name from the mirrored UrlToken[] representation.
   * This method provides backward compatibility with existing code that expects
   * URL token access for initial state hydration.
   *
   * @param name The name of the token to retrieve
   */
  getTokenByName(name: string): UrlToken | undefined;

  /**
   * The number of active filter elements
   */
  readonly count: number;

  /**
   * Must be called when page is unloaded in useEffect
   */
  cleanup(): void;
}
