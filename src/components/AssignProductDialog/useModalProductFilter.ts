import { ProductWhereInput } from "@dashboard/graphql";
import { useMemo } from "react";

import { useProductInitialAPIState } from "../ConditionalFilter/API/initialState/product/useProductInitialAPIState";
import { useProductFilterAPIProvider } from "../ConditionalFilter/API/providers/ProductFilterAPIProvider";
import { STATIC_CONDITIONS, STATIC_PRODUCT_OPTIONS } from "../ConditionalFilter/constants";
import { ConditionalFilterContext } from "../ConditionalFilter/context/context";
import { Condition } from "../ConditionalFilter/FilterElement/Condition";
import { ConditionOptions } from "../ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "../ConditionalFilter/FilterElement/ConditionSelected";
import { ItemOption } from "../ConditionalFilter/FilterElement/ConditionValue";
import { Constraint, GLOBAL } from "../ConditionalFilter/FilterElement/Constraint";
import {
  ExpressionValue,
  FilterContainer,
  FilterElement,
} from "../ConditionalFilter/FilterElement/FilterElement";
import { LeftOperand } from "../ConditionalFilter/LeftOperandsProvider";
import { createProductQueryVariables, QUERY_API_TYPES } from "../ConditionalFilter/queryVariables";
import {
  applyMiddleware,
  createConstraintMiddleware,
  useContainerStateStore,
  useFilterValueProvider,
  useModalFilterStore,
} from "../ConditionalFilter/store";
import { useFilterLeftOperandsProvider } from "../ConditionalFilter/useFilterLeftOperands";
import { useFilterWindow } from "../ConditionalFilter/useFilterWindow";
import { InitialConstraints, ProductTypeConstraint } from "./ModalProductFilterProvider";

export interface UseModalProductFilterOptions {
  excludedFilters?: string[];
  initialConstraints?: InitialConstraints;
}

export interface UseModalProductFilterResult {
  filterContext: React.ContextType<typeof ConditionalFilterContext>;
  filterVariables: ProductWhereInput;
  filterChannel: string | undefined;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export const getFilteredProductOptions = (
  excludedFilters?: string[],
  initialConstraints?: InitialConstraints,
): LeftOperand[] => {
  const exclusions = new Set<string>(excludedFilters ?? []);

  // If productType constraint is active, exclude productType from options
  if (initialConstraints?.productTypes?.length) {
    exclusions.add("productType");
  }

  if (exclusions.size === 0) {
    return STATIC_PRODUCT_OPTIONS;
  }

  return STATIC_PRODUCT_OPTIONS.filter(option => {
    return !exclusions.has(option.value);
  });
};

/**
 * Creates a locked FilterElement for productType constraint.
 * This element has all operands disabled and cannot be removed.
 */
export const createProductTypeConstraintElement = (
  productTypes: ProductTypeConstraint[],
): FilterElement => {
  const expressionValue = new ExpressionValue("productType", "ProductType", "productType");

  const productTypeLabels: ItemOption[] = productTypes.map(productTypeConstraint => ({
    label: productTypeConstraint.name,
    value: productTypeConstraint.id,
    slug: productTypeConstraint.id,
  }));

  // Create condition with "in" operator and the selected productType IDs
  const options = ConditionOptions.fromStaticElementName("productType");
  const inOption = STATIC_CONDITIONS.productType[1];

  const conditionSelected = ConditionSelected.fromConditionItemAndValue(
    inOption,
    productTypeLabels,
  );
  const condition = new Condition(options, conditionSelected, false);

  // Create the filter element - the constructor will call updateConstraint() which
  // sets a default constraint based on static config
  const element = new FilterElement(expressionValue, condition, false);

  // Override the constraint with our fully locked constraint AFTER construction
  // This ensures our disabled fields are respected in the UI
  element.setConstraint(new Constraint(GLOBAL, ["left", "right", "condition"], false));

  return element;
};

/**
 * Strips GLOBAL constraint elements from a FilterContainer.
 * Used to exclude constraint elements from URL persistence.
 *
 * Example:
 *   [constraint, "AND", filter1, "AND", filter2]
 *   → ["AND", filter1, "AND", filter2]  (after filtering)
 *   → [filter1, "AND", filter2]         (after removing orphaned "AND")
 */
export const stripGlobalConstraints = (filterValue: FilterContainer): FilterContainer => {
  const nonConstraintElements = filterValue.filter(
    item => !FilterElement.isFilterElement(item) || !item.constraint?.isGlobal,
  );

  // Remove orphaned "AND" left after removing constraint at index 0
  if (nonConstraintElements[0] === "AND") {
    return nonConstraintElements.slice(1);
  }

  return nonConstraintElements;
};

/**
 * Hook for modal product filters using the external store pattern with middleware.
 *
 * This replaces the old `createWrappedValueProvider` pattern which had issues
 * with stale closures. Instead, we use middleware to:
 * - Inject constraints into the snapshot
 * - Strip constraints before persisting to URL
 * - Handle constraint-specific behavior (isPersisted, getTokenByName)
 */
export const useModalProductFilter = ({
  excludedFilters,
  initialConstraints,
}: UseModalProductFilterOptions = {}): UseModalProductFilterResult => {
  const filteredOptions = useMemo(
    () => getFilteredProductOptions(excludedFilters, initialConstraints),
    [excludedFilters, initialConstraints],
  );

  const apiProvider = useProductFilterAPIProvider();
  const initialState = useProductInitialAPIState();

  // Create the base store using the modal-specific hook
  const { store: baseStore } = useModalFilterStore({
    type: "product",
    initialState,
  });

  // Create constraint element if productTypes are provided
  const constraintElement = useMemo(() => {
    if (!initialConstraints?.productTypes?.length) {
      return null;
    }

    return createProductTypeConstraintElement(initialConstraints.productTypes);
  }, [initialConstraints?.productTypes]);

  // Apply constraint middleware to the store
  // This replaces the old createWrappedValueProvider pattern
  const constrainedStore = useMemo(() => {
    if (!constraintElement) {
      return baseStore;
    }

    const middleware = createConstraintMiddleware(constraintElement);

    return applyMiddleware(baseStore, middleware);
  }, [baseStore, constraintElement]);

  // Create value provider from the constrained store
  const valueProvider = useFilterValueProvider(constrainedStore);

  // Create container state from the constrained store
  // No `syncOnce` needed - the store pattern handles this correctly
  const containerState = useContainerStateStore(constrainedStore);

  const leftOperandsProvider = useFilterLeftOperandsProvider(filteredOptions);
  const filterWindow = useFilterWindow();

  const filterContext = useMemo(
    () => ({
      apiProvider,
      valueProvider,
      leftOperandsProvider,
      containerState,
      filterWindow,
      queryApiType: QUERY_API_TYPES.PRODUCT,
    }),
    [apiProvider, valueProvider, leftOperandsProvider, containerState, filterWindow],
  );

  // Extract channel separately from where variables (channel is not valid in ProductWhereInput)
  // Use valueProvider.value (persisted URL state) - search only triggers when user saves filters
  const { filterVariables, filterChannel } = useMemo(() => {
    const queryVars = createProductQueryVariables(valueProvider.value);
    const { channel, ...where } = queryVars;

    return {
      filterVariables: where,
      filterChannel: channel?.eq,
    };
  }, [valueProvider.value]);

  const clearFilters = (): void => {
    valueProvider.clear();
    containerState.clear();
  };

  // Count active filters (excluding constraint)
  const hasActiveFilters = valueProvider.count > 0;

  return {
    filterContext,
    filterVariables,
    filterChannel,
    clearFilters,
    hasActiveFilters,
  };
};
