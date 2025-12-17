import { FilterContainer, FilterElement } from "../FilterElement";
import { UrlToken } from "../ValueProvider/UrlToken";
import { FilterStore } from "./FilterStore";

/**
 * Middleware interface for transforming FilterStore behavior.
 *
 * This replaces the `createWrappedValueProvider` pattern which had issues
 * with stale closures when spreading the base provider.
 *
 * Middleware is composable and doesn't create new object references
 * on every render, avoiding the re-sync issues.
 */
export interface FilterMiddleware {
  /**
   * Transform the snapshot value before returning to consumers.
   * Use this to inject constraints or modify the filter container.
   */
  transformSnapshot?: (value: FilterContainer) => FilterContainer;

  /**
   * Transform the value before persisting to URL.
   * Use this to strip constraints or filter out certain elements.
   */
  transformPersist?: (value: FilterContainer) => FilterContainer;

  /**
   * Transform the count value.
   * Use this to exclude constraint elements from the count.
   */
  transformCount?: (count: number, snapshot: FilterContainer) => number;

  /**
   * Override isPersisted behavior.
   * Return undefined to fall back to base implementation.
   */
  transformIsPersisted?: (
    element: FilterElement,
    baseResult: boolean,
    snapshot: FilterContainer,
  ) => boolean | undefined;

  /**
   * Override getTokenByName behavior.
   * Return undefined to fall back to base implementation, or null to indicate no token.
   */
  transformGetTokenByName?: (
    name: string,
    baseResult: UrlToken | undefined,
  ) => UrlToken | undefined | null;
}

/**
 * Create a new FilterStore that applies middleware transformations.
 *
 * This is a pure wrapper that delegates to the base store and applies
 * transformations at read/write time. No state is duplicated.
 */
export function applyMiddleware(baseStore: FilterStore, middleware: FilterMiddleware): FilterStore {
  const {
    transformSnapshot,
    transformPersist,
    transformCount,
    transformIsPersisted,
    transformGetTokenByName,
  } = middleware;

  return {
    // Delegate subscription to base store
    subscribe: baseStore.subscribe,

    // Transform snapshot if middleware provides transformer
    getSnapshot: () => {
      const baseSnapshot = baseStore.getSnapshot();

      return transformSnapshot ? transformSnapshot(baseSnapshot) : baseSnapshot;
    },

    // Delegate loading to base store
    getLoading: baseStore.getLoading,

    // Transform value before persisting
    persist: (value: FilterContainer) => {
      const transformedValue = transformPersist ? transformPersist(value) : value;

      baseStore.persist(transformedValue);
    },

    // Delegate clear to base store
    clear: baseStore.clear,

    // Transform isPersisted if middleware provides transformer
    isPersisted: (element: FilterElement) => {
      const baseResult = baseStore.isPersisted(element);

      if (transformIsPersisted) {
        const snapshot = transformSnapshot
          ? transformSnapshot(baseStore.getSnapshot())
          : baseStore.getSnapshot();
        const transformed = transformIsPersisted(element, baseResult, snapshot);

        if (transformed !== undefined) {
          return transformed;
        }
      }

      return baseResult;
    },

    // Transform getTokenByName if middleware provides transformer
    getTokenByName: (name: string) => {
      const baseResult = baseStore.getTokenByName(name);

      if (transformGetTokenByName) {
        const transformed = transformGetTokenByName(name, baseResult);

        // null means "explicitly no token" (different from undefined which means "not found")
        if (transformed === null) {
          return undefined;
        }

        if (transformed !== undefined) {
          return transformed;
        }
      }

      return baseResult;
    },

    // Transform count if middleware provides transformer
    getCount: () => {
      const baseCount = baseStore.getCount();

      if (transformCount) {
        const snapshot = transformSnapshot
          ? transformSnapshot(baseStore.getSnapshot())
          : baseStore.getSnapshot();

        return transformCount(baseCount, snapshot);
      }

      return baseCount;
    },

    // Delegate getFetchingParams to base store
    getFetchingParams: baseStore.getFetchingParams,

    // Delegate dispose to base store
    dispose: baseStore.dispose,
  };
}

/**
 * Compose multiple middlewares into a single middleware.
 * Middlewares are applied in order (first middleware's transformations run first).
 */
export function composeMiddleware(...middlewares: FilterMiddleware[]): FilterMiddleware {
  return {
    transformSnapshot: value => {
      return middlewares.reduce((acc, mw) => {
        return mw.transformSnapshot ? mw.transformSnapshot(acc) : acc;
      }, value);
    },

    transformPersist: value => {
      return middlewares.reduce((acc, mw) => {
        return mw.transformPersist ? mw.transformPersist(acc) : acc;
      }, value);
    },

    transformCount: (count, snapshot) => {
      return middlewares.reduce((acc, mw) => {
        return mw.transformCount ? mw.transformCount(acc, snapshot) : acc;
      }, count);
    },

    transformIsPersisted: (element, baseResult, snapshot) => {
      for (const mw of middlewares) {
        if (mw.transformIsPersisted) {
          const result = mw.transformIsPersisted(element, baseResult, snapshot);

          if (result !== undefined) {
            return result;
          }
        }
      }

      return undefined;
    },

    transformGetTokenByName: (name, baseResult) => {
      for (const mw of middlewares) {
        if (mw.transformGetTokenByName) {
          const result = mw.transformGetTokenByName(name, baseResult);

          if (result !== undefined) {
            return result;
          }
        }
      }

      return undefined;
    },
  };
}

// ============================================================================
// Pre-built middleware factories for common use cases
// ============================================================================

/**
 * Create middleware that injects a constraint element at the beginning of filters.
 *
 * This replaces the constraint injection logic from `createWrappedValueProvider`.
 */
export function createConstraintMiddleware(
  constraintElement: FilterElement | null,
): FilterMiddleware {
  if (!constraintElement) {
    return {}; // No-op middleware
  }

  return {
    // Inject constraint at beginning of snapshot
    transformSnapshot: value => {
      if (value.length === 0) {
        return [constraintElement];
      }

      return [constraintElement, "AND" as const, ...value];
    },

    // Strip GLOBAL constraints before persisting
    transformPersist: value => {
      return stripGlobalConstraints(value);
    },

    // Exclude constraint from count
    transformCount: count => {
      // The constraint adds 1 to the count, so subtract it
      return Math.max(0, count);
    },

    // GLOBAL constraints are always considered "persisted"
    transformIsPersisted: (element, _baseResult) => {
      if (element.constraint?.isGlobal) {
        return true;
      }

      return undefined; // Fall back to base implementation
    },

    // Don't return token for constraint fields
    transformGetTokenByName: name => {
      // Check if this is a constraint field by checking the constraint element
      if (constraintElement.value.value === name) {
        return null; // Explicitly no token
      }

      return undefined; // Fall back to base implementation
    },
  };
}

/**
 * Strips GLOBAL constraint elements from a FilterContainer.
 * Used to exclude constraint elements from URL persistence.
 *
 * Example:
 *   [constraint, "AND", filter1, "AND", filter2]
 *   → ["AND", filter1, "AND", filter2]  (after filtering)
 *   → [filter1, "AND", filter2]         (after removing orphaned "AND")
 */
export function stripGlobalConstraints(filterValue: FilterContainer): FilterContainer {
  const nonConstraintElements = filterValue.filter(
    item => !FilterElement.isFilterElement(item) || !item.constraint?.isGlobal,
  );

  // Remove orphaned "AND" left after removing constraint at index 0
  if (nonConstraintElements[0] === "AND") {
    return nonConstraintElements.slice(1);
  }

  return nonConstraintElements;
}

/**
 * Create middleware that preserves certain URL params during persist.
 * This is useful for modal filters that need to keep action/ids params.
 */
export function createPreservedParamsMiddleware(_preservedParams: string[]): FilterMiddleware {
  // Note: Preserved params are handled at the store level, not middleware
  // This middleware is a no-op but kept for API consistency
  return {};
}
