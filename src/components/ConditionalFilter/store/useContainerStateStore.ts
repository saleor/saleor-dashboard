import { useCallback, useState, useSyncExternalStore } from "react";

import { FilterContainer, FilterElement } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { FilterStore } from "./FilterStore";

type StateCallback = (el: FilterElement) => void;
type Element = FilterContainer[number];

/**
 * Return type matching the original useContainerState hook.
 */
export interface ContainerState {
  value: FilterContainer;
  create: (element: FilterElement) => void;
  createAndRemoveEmpty: (element: FilterElement) => void;
  createEmpty: () => void;
  exist: (slug: string) => boolean;
  updateBySlug: (slug: string, cb: StateCallback) => void;
  getAt: (position: string) => Element | undefined;
  updateAt: (position: string, cb: StateCallback) => void;
  removeAt: (position: string) => void;
  clear: () => void;
  clearEmpty: () => void;
}

// ============================================================================
// Helper functions (moved from useContainerState.ts)
// ============================================================================

const removeConstraint = (container: FilterContainer): FilterContainer => {
  return container.map(el => {
    if (!FilterElement.isFilterElement(el)) {
      return el;
    }

    if (!el.constraint?.existIn(container)) {
      el.clearConstraint();
    }

    return el;
  });
};

const calculateIndexesToRemove = (container: FilterContainer, position: number): number[] => {
  const next = position + 1;
  const previous = position - 1;
  const indexTuple = [position];

  if (typeof container[next] === "string") {
    indexTuple.push(next);

    return indexTuple;
  }

  if (typeof container[previous] === "string") {
    indexTuple.push(previous);
  }

  return indexTuple;
};

const removeElement = (container: FilterContainer, position: number): FilterContainer => {
  const indexTuple = calculateIndexesToRemove(container, position);
  const newContainer = container.filter((_, elIndex) => !indexTuple.includes(elIndex));

  return removeConstraint(newContainer);
};

const removeEmptyElements = (
  container: FilterContainer,
  isPersisted: (element: FilterElement) => boolean,
): FilterContainer => {
  const emptyIndex = container.findIndex(
    el => FilterElement.isFilterElement(el) && (!isPersisted(el) || el.isEmpty()),
  );

  if (emptyIndex < 0) {
    return container;
  }

  return removeEmptyElements(removeElement(container, emptyIndex), isPersisted);
};

const createNewValue = (currentValue: FilterContainer, element: FilterElement): FilterContainer => {
  const newValue: FilterContainer = [];

  if (currentValue.length > 0) {
    newValue.push("AND");
  }

  newValue.push(element);

  return newValue;
};

// ============================================================================
// Main hook
// ============================================================================

/**
 * Hook for managing local filter editing state using a FilterStore.
 *
 * This replaces useContainerState with a store-based approach that:
 * - Reads initial value synchronously from store (no useEffect needed)
 * - Maintains local draft state for unsaved edits
 * - No `syncOnce` bandaid needed - store handles URL sync properly
 *
 * The key insight is that this hook manages a "draft" that can diverge
 * from the persisted URL state until the user confirms changes.
 */
export function useContainerStateStore(store: FilterStore): ContainerState {
  // Read persisted state synchronously from store
  const persistedValue = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );

  // Local draft state for unsaved edits
  // Initialize with persisted value, then manage independently
  const [draft, setDraft] = useState<FilterContainer>(() => persistedValue);

  // Track if we've diverged from persisted state
  const [hasDraft, setHasDraft] = useState(false);

  // The value to expose: draft if we have one, otherwise persisted
  const value = hasDraft ? draft : persistedValue;

  // Helper to wrap isPersisted for removeEmptyElements
  const isPersisted = useCallback((element: FilterElement) => store.isPersisted(element), [store]);

  // ============================================================================
  // State mutation methods
  // ============================================================================

  const updateDraft = useCallback((updater: (v: FilterContainer) => FilterContainer) => {
    setDraft(v => updater(v));
    setHasDraft(true);
  }, []);

  const updateAt = useCallback(
    (position: string, cb: StateCallback) => {
      const index = parseInt(position, 10);
      const element = value[index];

      // Respect fully disabled constraints (all controls disabled)
      if (FilterElement.isFilterElement(element)) {
        const isFullyDisabled =
          element.constraint?.disabled?.includes("left") &&
          element.constraint?.disabled?.includes("right") &&
          element.constraint?.disabled?.includes("condition");

        if (isFullyDisabled) {
          return;
        }
      }

      updateDraft(v =>
        v.map((el, elIndex) => {
          if (elIndex === index && FilterElement.isFilterElement(el)) {
            cb(el);
          }

          return el;
        }),
      );
    },
    [value, updateDraft],
  );

  const getAt = useCallback(
    (position: string): Element | undefined => {
      const index = parseInt(position, 10);

      return value[index];
    },
    [value],
  );

  const updateBySlug = useCallback(
    (slug: string, cb: StateCallback) => {
      updateDraft(v =>
        v.map(el => {
          if (FilterElement.isFilterElement(el) && el.value.value === slug) {
            cb(el);
          }

          return el;
        }),
      );
    },
    [updateDraft],
  );

  const removeAt = useCallback(
    (position: string) => {
      const index = parseInt(position, 10);
      const element = value[index];

      // Respect constraint.removable === false
      if (FilterElement.isFilterElement(element) && element.constraint?.removable === false) {
        return;
      }

      updateDraft(v => removeElement(v, index));
    },
    [value, updateDraft],
  );

  const create = useCallback(
    (element: FilterElement) => {
      updateDraft(v => v.concat(createNewValue(v, element)));
    },
    [updateDraft],
  );

  const createAndRemoveEmpty = useCallback(
    (element: FilterElement) => {
      updateDraft(v => {
        const filteredValue = removeEmptyElements(v, isPersisted);
        const newValue = createNewValue(filteredValue, element);

        return filteredValue.concat(newValue);
      });
    },
    [updateDraft, isPersisted],
  );

  const exist = useCallback(
    (slug: string): boolean => {
      return value.some(
        entry => FilterElement.isFilterElement(entry) && entry.value.value === slug,
      );
    },
    [value],
  );

  const createEmpty = useCallback(() => {
    create(FilterElement.createEmpty());
  }, [create]);

  const clear = useCallback(() => {
    setDraft([]);
    setHasDraft(true);
  }, []);

  const clearEmpty = useCallback(() => {
    updateDraft(v => removeEmptyElements(v, isPersisted));
  }, [updateDraft, isPersisted]);

  return {
    value,
    create,
    createAndRemoveEmpty,
    createEmpty,
    exist,
    updateBySlug,
    getAt,
    updateAt,
    removeAt,
    clear,
    clearEmpty,
  };
}

/**
 * Hook that provides backward compatibility with the original useContainerState API.
 * Uses FilterValueProvider instead of FilterStore directly.
 *
 * This can be used during migration to maintain the same API while
 * transitioning to the store-based approach.
 */
export function useContainerStateFromProvider(valueProvider: FilterValueProvider): ContainerState {
  // Local draft state for unsaved edits
  const [draft, setDraft] = useState<FilterContainer>(() => valueProvider.value);
  const [hasDraft, setHasDraft] = useState(false);

  // Sync with valueProvider when it's not loading and we don't have local edits
  // This replaces the useEffect sync from the original hook
  const value = hasDraft ? draft : valueProvider.value;

  const isPersisted = useCallback(
    (element: FilterElement) => valueProvider.isPersisted(element),
    [valueProvider],
  );

  const updateDraft = useCallback((updater: (v: FilterContainer) => FilterContainer) => {
    setDraft(v => updater(v));
    setHasDraft(true);
  }, []);

  const updateAt = useCallback(
    (position: string, cb: StateCallback) => {
      const index = parseInt(position, 10);
      const element = value[index];

      if (FilterElement.isFilterElement(element)) {
        const isFullyDisabled =
          element.constraint?.disabled?.includes("left") &&
          element.constraint?.disabled?.includes("right") &&
          element.constraint?.disabled?.includes("condition");

        if (isFullyDisabled) {
          return;
        }
      }

      updateDraft(v =>
        v.map((el, elIndex) => {
          if (elIndex === index && FilterElement.isFilterElement(el)) {
            cb(el);
          }

          return el;
        }),
      );
    },
    [value, updateDraft],
  );

  const getAt = useCallback(
    (position: string): Element | undefined => {
      const index = parseInt(position, 10);

      return value[index];
    },
    [value],
  );

  const updateBySlug = useCallback(
    (slug: string, cb: StateCallback) => {
      updateDraft(v =>
        v.map(el => {
          if (FilterElement.isFilterElement(el) && el.value.value === slug) {
            cb(el);
          }

          return el;
        }),
      );
    },
    [updateDraft],
  );

  const removeAt = useCallback(
    (position: string) => {
      const index = parseInt(position, 10);
      const element = value[index];

      if (FilterElement.isFilterElement(element) && element.constraint?.removable === false) {
        return;
      }

      updateDraft(v => removeElement(v, index));
    },
    [value, updateDraft],
  );

  const create = useCallback(
    (element: FilterElement) => {
      updateDraft(v => v.concat(createNewValue(v, element)));
    },
    [updateDraft],
  );

  const createAndRemoveEmpty = useCallback(
    (element: FilterElement) => {
      updateDraft(v => {
        const filteredValue = removeEmptyElements(v, isPersisted);
        const newValue = createNewValue(filteredValue, element);

        return filteredValue.concat(newValue);
      });
    },
    [updateDraft, isPersisted],
  );

  const exist = useCallback(
    (slug: string): boolean => {
      return value.some(
        entry => FilterElement.isFilterElement(entry) && entry.value.value === slug,
      );
    },
    [value],
  );

  const createEmpty = useCallback(() => {
    create(FilterElement.createEmpty());
  }, [create]);

  const clear = useCallback(() => {
    setDraft([]);
    setHasDraft(true);
  }, []);

  const clearEmpty = useCallback(() => {
    updateDraft(v => removeEmptyElements(v, isPersisted));
  }, [updateDraft, isPersisted]);

  return {
    value,
    create,
    createAndRemoveEmpty,
    createEmpty,
    exist,
    updateBySlug,
    getAt,
    updateAt,
    removeAt,
    clear,
    clearEmpty,
  };
}
