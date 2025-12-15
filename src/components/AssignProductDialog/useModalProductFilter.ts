import { ProductWhereInput } from "@dashboard/graphql";
import { useMemo } from "react";

import { useProductInitialAPIState } from "../ConditionalFilter/API/initialState/product/useProductInitialAPIState";
import { useProductFilterAPIProvider } from "../ConditionalFilter/API/providers/ProductFilterAPIProvider";
import { STATIC_PRODUCT_OPTIONS } from "../ConditionalFilter/constants";
import { ConditionalFilterContext } from "../ConditionalFilter/context/context";
import { Condition } from "../ConditionalFilter/FilterElement/Condition";
import { ConditionOptions } from "../ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "../ConditionalFilter/FilterElement/ConditionSelected";
import { ItemOption } from "../ConditionalFilter/FilterElement/ConditionValue";
import { Constraint } from "../ConditionalFilter/FilterElement/Constraint";
import {
  ExpressionValue,
  FilterContainer,
  FilterElement,
} from "../ConditionalFilter/FilterElement/FilterElement";
import { LeftOperand } from "../ConditionalFilter/LeftOperandsProvider";
import { createProductQueryVariables, QUERY_API_TYPES } from "../ConditionalFilter/queryVariables";
import { useContainerState } from "../ConditionalFilter/useContainerState";
import { useFilterLeftOperandsProvider } from "../ConditionalFilter/useFilterLeftOperands";
import { useFilterWindow } from "../ConditionalFilter/useFilterWindow";
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

const getFilteredProductOptions = (
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

  // Also exclude any options that depend on an excluded option (e.g. `price` depends on `channel`)
  return STATIC_PRODUCT_OPTIONS.filter(option => {
    if (exclusions.has(option.value)) {
      return false;
    }

    const dependency = Constraint.getDependency(option.value);

    return !dependency || !exclusions.has(dependency);
  });
};

/**
 * Creates a locked FilterElement for productType constraint.
 * This element has all operands disabled and cannot be removed.
 */
const createProductTypeConstraintElement = (
  productTypes: ProductTypeConstraint[],
): FilterElement => {
  // Create expression value for productType
  const expressionValue = new ExpressionValue("productType", "ProductType", "productType");

  // Convert ProductTypeConstraint[] to ItemOption[]
  const productTypeLabels: ItemOption[] = productTypes.map(pt => ({
    label: pt.name,
    value: pt.id,
    slug: pt.id,
  }));

  // Create condition with "in" operator and the selected productType IDs
  const options = ConditionOptions.fromStaticElementName("productType");
  const inOption = options.findByLabel("in") ?? options.first();

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
  element.setConstraint(new Constraint([], ["left", "right", "condition"], false));

  return element;
};

const stripProductTypeFromPersistedValue = (filterValue: FilterContainer): FilterContainer => {
  const collectElements = (container: FilterContainer): FilterElement[] => {
    const collected: FilterElement[] = [];

    for (const item of container) {
      if (FilterElement.isFilterElement(item)) {
        if (item.value.value !== "productType") {
          collected.push(item);
        }

        continue;
      }

      if (Array.isArray(item)) {
        collected.push(...collectElements(item));
      }
    }

    return collected;
  };

  const remainingElements = collectElements(filterValue);

  return remainingElements.flatMap((element, index) =>
    index === 0 ? [element] : (["AND", element] as const),
  );
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
  const hasProductTypeConstraint = Boolean(initialConstraints?.productTypes?.length);

  // Create constraint element if productTypes are provided
  const constraintElement = useMemo(() => {
    if (!initialConstraints?.productTypes?.length) {
      return null;
    }

    return createProductTypeConstraintElement(initialConstraints.productTypes);
  }, [initialConstraints?.productTypes]);

  const persistedValueWithoutProductType = useMemo<FilterContainer>(() => {
    if (!hasProductTypeConstraint) {
      return valueProvider.value;
    }

    return stripProductTypeFromPersistedValue(valueProvider.value);
  }, [hasProductTypeConstraint, valueProvider.value]);

  const wrappedValueProvider = useMemo(() => {
    if (!hasProductTypeConstraint) {
      return valueProvider;
    }

    return {
      ...valueProvider,
      count: persistedValueWithoutProductType.filter(v => typeof v !== "string").length,
      value: persistedValueWithoutProductType,
      persist: (filterValue: FilterContainer) => {
        valueProvider.persist(stripProductTypeFromPersistedValue(filterValue));
      },
      isPersisted: (element: FilterElement) => {
        return persistedValueWithoutProductType.some(
          p => FilterElement.isFilterElement(p) && p.equals(element),
        );
      },
      getTokenByName: (name: string) => {
        if (name === "productType") {
          return undefined;
        }

        return valueProvider.getTokenByName(name);
      },
    };
  }, [hasProductTypeConstraint, persistedValueWithoutProductType, valueProvider]);

  const baseContainerState = useContainerState(wrappedValueProvider);

  // Wrap container state to inject constraint element
  const containerState = useMemo(() => {
    if (!constraintElement) {
      return baseContainerState;
    }

    const hasUserFilters = baseContainerState.value.length > 0;
    const offset = hasUserFilters ? 2 : 1;

    const valueWithConstraint: FilterContainer = [
      constraintElement,
      ...(hasUserFilters ? ["AND" as const, ...baseContainerState.value] : []),
    ];

    return {
      ...baseContainerState,
      value: valueWithConstraint,
      // Override removeAt to prevent removing the constraint element
      removeAt: (position: string) => {
        const index = parseInt(position, 10);

        // Index 0 is the constraint element - don't allow removal
        if (index === 0) {
          return;
        }

        // Index 1 is "AND" separator when there are user filters
        if (hasUserFilters && index === 1) {
          return;
        }

        const adjustedPosition = String(index - offset);

        baseContainerState.removeAt(adjustedPosition);
      },
      // Override updateAt to prevent updating the constraint element
      updateAt: (position: string, cb: (el: FilterElement) => void) => {
        const index = parseInt(position, 10);

        // Index 0 is the constraint element - don't allow updates
        if (index === 0) {
          return;
        }

        // Index 1 is "AND" separator when there are user filters
        if (hasUserFilters && index === 1) {
          return;
        }

        const adjustedPosition = String(index - offset);

        baseContainerState.updateAt(adjustedPosition, cb);
      },
      // Override getAt to handle constraint element
      getAt: (position: string) => {
        const index = parseInt(position, 10);

        if (index === 0) {
          return constraintElement;
        }

        if (hasUserFilters && index === 1) {
          return "AND";
        }

        const adjustedPosition = String(index - offset);

        return baseContainerState.getAt(adjustedPosition);
      },
    };
  }, [baseContainerState, constraintElement]);

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

  const persistedValueWithConstraints = useMemo<FilterContainer>(() => {
    if (!constraintElement) {
      return wrappedValueProvider.value;
    }

    if (wrappedValueProvider.value.length === 0) {
      return [constraintElement];
    }

    return [constraintElement, "AND" as const, ...wrappedValueProvider.value];
  }, [constraintElement, wrappedValueProvider.value]);

  // Extract channel separately from where variables (channel is not valid in ProductWhereInput)
  const { filterVariables, filterChannel } = useMemo(() => {
    const queryVars = createProductQueryVariables(persistedValueWithConstraints);
    const { channel, ...where } = queryVars;

    return {
      filterVariables: where,
      filterChannel: channel?.eq,
    };
  }, [persistedValueWithConstraints]);

  const clearFilters = () => {
    wrappedValueProvider.clear();
    baseContainerState.clear();
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
