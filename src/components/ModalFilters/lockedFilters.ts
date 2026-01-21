import * as Sentry from "@sentry/react";

import { STATIC_CONDITIONS } from "../ConditionalFilter/constants";
import { Condition } from "../ConditionalFilter/FilterElement/Condition";
import {
  AnyFilterElementName,
  ConditionOptions,
} from "../ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "../ConditionalFilter/FilterElement/ConditionSelected";
import { ItemOption } from "../ConditionalFilter/FilterElement/ConditionValue";
import { Constraint, GLOBAL } from "../ConditionalFilter/FilterElement/Constraint";
import {
  ExpressionValue,
  FilterContainer,
  FilterElement,
} from "../ConditionalFilter/FilterElement/FilterElement";
import { FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";
import { UrlToken } from "../ConditionalFilter/ValueProvider/UrlToken";
import { LockedFilter } from "./types";

export const createLockedFilterElement = (lockedFilter: LockedFilter): FilterElement => {
  const expressionValue = new ExpressionValue(
    lockedFilter.field,
    lockedFilter.field.charAt(0).toUpperCase() + lockedFilter.field.slice(1),
    lockedFilter.field,
  );

  const itemOptions: ItemOption[] = lockedFilter.values.map(value => ({
    label: value.name,
    value: value.id,
    slug: value.id,
  }));

  const options = ConditionOptions.fromName(lockedFilter.field as AnyFilterElementName);
  const inOption = STATIC_CONDITIONS[lockedFilter.field as keyof typeof STATIC_CONDITIONS]?.[1];

  if (!inOption) {
    const error = new Error(`No 'in' condition found for field: ${lockedFilter.field}`);

    Sentry.captureException(error);
    throw error;
  }

  const conditionSelected = ConditionSelected.fromConditionItemAndValue(inOption, itemOptions);
  const condition = new Condition(options, conditionSelected, false);

  const element = new FilterElement(expressionValue, condition, false);

  element.setConstraint(new Constraint(GLOBAL, ["left", "right", "condition"], false));

  return element;
};

export const stripGlobalConstraints = (filterValue: FilterContainer): FilterContainer => {
  const nonConstraintElements = filterValue.filter(
    item => !FilterElement.isFilterElement(item) || !item.constraint?.isGlobal,
  );

  if (nonConstraintElements[0] === "AND") {
    return nonConstraintElements.slice(1);
  }

  return nonConstraintElements;
};

/** Wraps valueProvider from ConditionalFilter with logic for filters in modals
 * adds locking filter option (e.g. when selecting reference attribute with defined `referenceTypes`)
 * - remove from total variables count
 * - don't store it in URL
 *  */
export const createWrappedValueProvider = (
  valueProvider: FilterValueProvider,
  lockedElement: FilterElement | null,
  lockedField?: string,
): FilterValueProvider => {
  if (!lockedElement) {
    return valueProvider;
  }

  const finalValue: FilterContainer =
    valueProvider.value.length === 0
      ? [lockedElement]
      : [lockedElement, "AND" as const, ...valueProvider.value];

  return {
    ...valueProvider,
    value: finalValue,
    count: valueProvider.value.filter(v => typeof v !== "string").length,
    persist: (filterValue: FilterContainer): void => {
      valueProvider.persist(stripGlobalConstraints(filterValue));
    },
    isPersisted: (element: FilterElement): boolean => {
      if (element.constraint?.isGlobal) {
        return true;
      }

      return valueProvider.value.some(p => FilterElement.isFilterElement(p) && p.equals(element));
    },
    getTokenByName: (name: string): UrlToken | undefined => {
      if (lockedField && name === lockedField) {
        return undefined;
      }

      return valueProvider.getTokenByName(name);
    },
  };
};

export const getFilteredOptions = <T extends { value: string }>(
  options: T[],
  excludedFilters?: string[],
  lockedFilter?: LockedFilter,
): T[] => {
  const exclusions = new Set<string>(excludedFilters ?? []);

  if (lockedFilter) {
    exclusions.add(lockedFilter.field);
  }

  if (exclusions.size === 0) {
    return options;
  }

  return options.filter(option => !exclusions.has(option.value));
};
