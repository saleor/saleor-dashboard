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
import { FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { LeftOperand } from "../ConditionalFilter/LeftOperandsProvider";
import { createProductQueryVariables, QUERY_API_TYPES } from "../ConditionalFilter/queryVariables";
import { useContainerState } from "../ConditionalFilter/useContainerState";
import { useFilterLeftOperandsProvider } from "../ConditionalFilter/useFilterLeftOperands";
import { useFilterWindow } from "../ConditionalFilter/useFilterWindow";
import { UrlToken } from "../ConditionalFilter/ValueProvider/UrlToken";
import { InitialConstraints, ProductTypeConstraint } from "./ModalProductFilterProvider";
import { useModalUrlValueProvider } from "./useModalUrlValueProvider";

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
 * Creates a wrapped value provider that injects a constraint element and handles
 * GLOBAL constraint-specific behavior for persistence, counting, and token lookup.
 *
 * What it does:
 * 1. Inject constraint element at the beginning of filter value
 * 2. Strip GLOBAL constraints when persisting to URL
 * 3. Exclude constraint from count
 */
export const createWrappedValueProvider = (
  valueProvider: FilterValueProvider,
  constraintElement: FilterElement | null,
): FilterValueProvider => {
  if (!constraintElement) {
    return valueProvider;
  }

  // Compute the value with constraint injected
  const finalValue: FilterContainer =
    valueProvider.value.length === 0
      ? [constraintElement]
      : [constraintElement, "AND" as const, ...valueProvider.value];

  return {
    ...valueProvider,
    value: finalValue,
    // Exclude "GLOBAL" constraints from displayed count
    count: valueProvider.value.filter(v => typeof v !== "string").length,
    // Strip GLOBAL constraints before persisting to URL
    persist: (filterValue: FilterContainer): void => {
      valueProvider.persist(stripGlobalConstraints(filterValue));
    },
    // GLOBAL constraints are always considered "persisted"
    isPersisted: (element: FilterElement): boolean => {
      if (element.constraint?.isGlobal) {
        return true;
      }

      return valueProvider.value.some(p => FilterElement.isFilterElement(p) && p.equals(element));
    },
    // Don't return token for constraint fields (they're not from URL)
    getTokenByName: (name: string): UrlToken | undefined => {
      if (name === "productType") {
        return undefined;
      }

      return valueProvider.getTokenByName(name);
    },
  };
};

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
  const valueProvider = useModalUrlValueProvider(initialState);
  const leftOperandsProvider = useFilterLeftOperandsProvider(filteredOptions);
  const filterWindow = useFilterWindow();

  // Create constraint element if productTypes are provided
  const constraintElement = useMemo(() => {
    if (!initialConstraints?.productTypes?.length) {
      return null;
    }

    return createProductTypeConstraintElement(initialConstraints.productTypes);
  }, [initialConstraints?.productTypes]);

  const wrappedValueProvider = useMemo(
    () => createWrappedValueProvider(valueProvider, constraintElement),
    [constraintElement, valueProvider],
  );

  const containerState = useContainerState(wrappedValueProvider, { syncOnce: true });

  const filterContext = useMemo(
    () => ({
      apiProvider,
      valueProvider: wrappedValueProvider,
      leftOperandsProvider,
      containerState,
      filterWindow,
      queryApiType: QUERY_API_TYPES.PRODUCT,
    }),
    [apiProvider, wrappedValueProvider, leftOperandsProvider, containerState, filterWindow],
  );

  // Extract channel separately from where variables (channel is not valid in ProductWhereInput)
  // Use wrappedValueProvider.value (persisted URL state) - search only triggers when user saves filters
  const { filterVariables, filterChannel } = useMemo(() => {
    const queryVars = createProductQueryVariables(wrappedValueProvider.value);
    const { channel, ...where } = queryVars;

    return {
      filterVariables: where,
      filterChannel: channel?.eq,
    };
  }, [wrappedValueProvider.value]);

  const clearFilters = (): void => {
    wrappedValueProvider.clear();
    containerState.clear();
  };

  // Count active filters (excluding constraint)
  const hasActiveFilters = wrappedValueProvider.count > 0;

  return {
    filterContext,
    filterVariables,
    filterChannel,
    clearFilters,
    hasActiveFilters,
  };
};
