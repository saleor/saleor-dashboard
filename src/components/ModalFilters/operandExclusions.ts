import { type FilterAPIProvider } from "../ConditionalFilter/API/FilterAPIProvider";
import { getFilterElement } from "../ConditionalFilter/API/utils";
import { type FilterContainer, FilterElement } from "../ConditionalFilter/FilterElement";
import { Condition } from "../ConditionalFilter/FilterElement/Condition";
import { ConditionSelected } from "../ConditionalFilter/FilterElement/ConditionSelected";
import {
  isItemOption,
  isItemOptionArray,
  type ItemOption,
} from "../ConditionalFilter/FilterElement/ConditionValue";
import { type FilterValueProvider } from "../ConditionalFilter/FilterValueProvider";

export type OperandValueExclusions = Partial<Record<"collection", string[]>>;

export const createOperandValueExclusions = (
  excludeCollections?: Array<{ id: string }>,
): OperandValueExclusions | undefined => {
  if (!excludeCollections?.length) {
    return undefined;
  }

  return {
    collection: excludeCollections.map(collection => collection.id),
  };
};

const filterItemOptions = (options: ItemOption[], excludedIds: Set<string>): ItemOption[] =>
  options.filter(option => !excludedIds.has(option.value));

export const stripExcludedOperandValues = (
  container: FilterContainer,
  exclusions: OperandValueExclusions | undefined,
): FilterContainer => {
  const excludedCollectionIds = exclusions?.collection;

  if (!excludedCollectionIds?.length) {
    return container;
  }

  const excludedIds = new Set(excludedCollectionIds);

  return container.map(entry => {
    if (!FilterElement.isFilterElement(entry) || entry.value.value !== "collection") {
      return entry;
    }

    const selectedValue = entry.condition.selected.value;

    if (isItemOptionArray(selectedValue)) {
      const filteredValue = filterItemOptions(selectedValue, excludedIds);

      if (filteredValue.length === selectedValue.length) {
        return entry;
      }

      const conditionValue = entry.condition.selected.conditionValue;

      if (!conditionValue) {
        return entry;
      }

      const condition = new Condition(
        entry.condition.options,
        ConditionSelected.fromConditionItemAndValue(conditionValue, filteredValue),
        entry.condition.loading,
      );

      if (isItemOptionArray(entry.condition.selected.options)) {
        condition.selected.setOptions(
          filterItemOptions(entry.condition.selected.options, excludedIds),
        );
      }

      return new FilterElement(
        entry.value,
        condition,
        entry.loading,
        entry.constraint,
        entry.selectedAttribute,
        entry.availableAttributesList,
        entry.attributeLoading,
      );
    }

    if (isItemOption(selectedValue) && excludedIds.has(selectedValue.value)) {
      const conditionValue = entry.condition.selected.conditionValue;

      if (!conditionValue) {
        return entry;
      }

      const condition = new Condition(
        entry.condition.options,
        ConditionSelected.fromConditionItemAndValue(conditionValue, []),
        entry.condition.loading,
      );

      return new FilterElement(
        entry.value,
        condition,
        entry.loading,
        entry.constraint,
        entry.selectedAttribute,
        entry.availableAttributesList,
        entry.attributeLoading,
      );
    }

    return entry;
  });
};

export const createOperandExclusionApiProvider = (
  base: FilterAPIProvider,
  exclusions: OperandValueExclusions | undefined,
): FilterAPIProvider => {
  const excludedCollectionIds = exclusions?.collection;

  if (!excludedCollectionIds?.length) {
    return base;
  }

  const excludedIds = new Set(excludedCollectionIds);

  return {
    ...base,
    fetchRightOptions: async (position, value, inputValue) => {
      const options = await base.fetchRightOptions(position, value, inputValue);
      const filterElement = getFilterElement(value, parseInt(position, 10));

      if (filterElement?.value.value !== "collection") {
        return options;
      }

      return filterItemOptions(options, excludedIds);
    },
  };
};

export const createOperandExclusionValueProvider = (
  valueProvider: FilterValueProvider,
  exclusions: OperandValueExclusions | undefined,
): FilterValueProvider => {
  if (!exclusions?.collection?.length) {
    return valueProvider;
  }

  const value = stripExcludedOperandValues(valueProvider.value, exclusions);
  const count = value.filter(entry => typeof entry !== "string").length;

  return {
    ...valueProvider,
    value,
    count,
  };
};
