/**
 * External Store Pattern for ConditionalFilter URL Synchronization
 *
 * This module provides a single-source-of-truth pattern for filter state
 * using React 18's useSyncExternalStore. It replaces the triple-state
 * useEffect chain with synchronous URL reads.
 *
 * Benefits:
 * - Single re-render per URL change (not 2-3)
 * - No race conditions between effects
 * - No `syncOnce` bandaids needed
 * - Browser back/forward works correctly
 *
 * @example Basic usage in a provider:
 * ```tsx
 * import { useFilterStore } from './store';
 *
 * function FilterProvider({ children }) {
 *   const initialState = useProductInitialAPIState();
 *   const { store, valueProvider } = useFilterStore({
 *     type: 'product',
 *     initialState,
 *   });
 *
 *   return (
 *     <FilterContext.Provider value={{ valueProvider }}>
 *       {children}
 *     </FilterContext.Provider>
 *   );
 * }
 * ```
 *
 * @example With constraints (modal usage):
 * ```tsx
 * import {
 *   useFilterStore,
 *   applyMiddleware,
 *   createConstraintMiddleware,
 * } from './store';
 *
 * function ModalFilterProvider({ constraint }) {
 *   const { store } = useModalFilterStore({ type: 'product', initialState });
 *
 *   const constraintMiddleware = useMemo(
 *     () => createConstraintMiddleware(constraint),
 *     [constraint]
 *   );
 *
 *   const constrainedStore = useMemo(
 *     () => applyMiddleware(store, constraintMiddleware),
 *     [store, constraintMiddleware]
 *   );
 *
 *   const valueProvider = useFilterValueProvider(constrainedStore);
 *   // ...
 * }
 * ```
 */

// Core store
export {
  createFilterStore,
  createFilterValueProviderFromStore,
  type FilterStore,
  type FilterStoreConfig,
} from "./FilterStore";

// React hooks
export {
  createFilterStoreFromConfig,
  useFilterCount,
  useFilterLoading,
  useFilterStore,
  useFilterValue,
  useFilterValueProvider,
  useModalFilterStore,
} from "./useFilterStore";

// Middleware
export {
  applyMiddleware,
  composeMiddleware,
  createConstraintMiddleware,
  createPreservedParamsMiddleware,
  type FilterMiddleware,
  stripGlobalConstraints,
} from "./middleware";

// Container state
export {
  type ContainerState,
  useContainerStateFromProvider,
  useContainerStateStore,
} from "./useContainerStateStore";
