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
  // Combine explicit exclusions with constraint-based exclusions
  const exclusions = [...(excludedFilters ?? [])];

  // If productType constraint is active, exclude productType from options
  if (initialConstraints?.productTypes?.length) {
    exclusions.push("productType");
  }

  if (exclusions.length === 0) {
    return STATIC_PRODUCT_OPTIONS;
  }

  return STATIC_PRODUCT_OPTIONS.filter(option => !exclusions.includes(option.value));
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
  const baseContainerState = useContainerState(valueProvider);
  const filterWindow = useFilterWindow();

  // Create constraint element if productTypes are provided
  const constraintElement = useMemo(() => {
    if (!initialConstraints?.productTypes?.length) {
      return null;
    }

    return createProductTypeConstraintElement(initialConstraints.productTypes);
  }, [initialConstraints?.productTypes]);

  // Wrap container state to inject constraint element
  const containerState = useMemo(() => {
    if (!constraintElement) {
      return baseContainerState;
    }

    // Filter out any productType elements from base value to prevent duplication
    // (productType may have been persisted to URL and loaded back)
    const filteredBaseValue = baseContainerState.value.filter(item => {
      if (item instanceof FilterElement) {
        return item.value.value !== "productType";
      }

      return true;
    });

    // Remove leading "AND" if present after filtering
    const cleanedBaseValue =
      filteredBaseValue.length > 0 && filteredBaseValue[0] === "AND"
        ? filteredBaseValue.slice(1)
        : filteredBaseValue;

    // Prepend constraint element to the container value
    const valueWithConstraint: FilterContainer = [
      constraintElement,
      ...(cleanedBaseValue.length > 0 ? ["AND" as const, ...cleanedBaseValue] : []),
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

        // Adjust the position for the underlying state (subtract 2 for constraint + AND)
        const adjustedPosition = String(index - 2);

        baseContainerState.removeAt(adjustedPosition);
      },
      // Override updateAt to prevent updating the constraint element
      updateAt: (position: string, cb: (el: FilterElement) => void) => {
        const index = parseInt(position, 10);

        // Index 0 is the constraint element - don't allow updates
        if (index === 0) {
          return;
        }

        // Adjust the position for the underlying state
        const adjustedPosition = String(index - 2);

        baseContainerState.updateAt(adjustedPosition, cb);
      },
      // Override getAt to handle constraint element
      getAt: (position: string) => {
        const index = parseInt(position, 10);

        if (index === 0) {
          return constraintElement;
        }

        if (index === 1) {
          return "AND";
        }

        const adjustedPosition = String(index - 2);

        return baseContainerState.getAt(adjustedPosition);
      },
    };
  }, [baseContainerState, constraintElement]);

  // Wrap valueProvider to filter out productType constraints before persisting
  const wrappedValueProvider = useMemo(() => {
    if (!constraintElement) {
      return valueProvider;
    }

    return {
      ...valueProvider,
      persist: (filterValue: FilterContainer) => {
        // Filter out productType elements before persisting to URL
        const filteredValue = filterValue.filter(item => {
          if (item instanceof FilterElement) {
            return item.value.value !== "productType";
          }

          return true;
        });

        // Remove leading "AND" if present after filtering
        const cleanedValue =
          filteredValue.length > 0 && filteredValue[0] === "AND"
            ? filteredValue.slice(1)
            : filteredValue;

        valueProvider.persist(cleanedValue);
      },
    };
  }, [valueProvider, constraintElement]);

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
  const { filterVariables, filterChannel } = useMemo(() => {
    const queryVars = createProductQueryVariables(valueProvider.value);
    const { channel, ...where } = queryVars;

    return {
      filterVariables: where,
      filterChannel: channel?.eq,
    };
  }, [valueProvider.value]);

  const clearFilters = () => {
    valueProvider.clear();
    baseContainerState.clear();
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
