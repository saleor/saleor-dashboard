import useDebounce from "@dashboard/hooks/useDebounce";
import { errorTracker } from "@dashboard/services/errorTracking";
import { type MutableRefObject, useRef } from "react";

import { type FilterAPIProvider } from "./API/FilterAPIProvider";
import { useConditionalFilterContext } from "./context";
import { FilterElement } from "./FilterElement";
import { Condition } from "./FilterElement/Condition";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { type ConditionValue } from "./FilterElement/ConditionValue";
import { Constraint } from "./FilterElement/Constraint";
import { hasEmptyRows } from "./FilterElement/FilterElement";
import { type LeftOperand } from "./LeftOperandsProvider";

const nextFetchGeneration = (
  generations: MutableRefObject<Record<string, number>>,
  key: string,
): number => {
  const next = (generations.current[key] ?? 0) + 1;

  generations.current[key] = next;

  return next;
};

const captureFilterFetchError = (error: unknown): void => {
  errorTracker.captureException(error instanceof Error ? error : new Error(String(error)));
};

export const useFilterContainer = (apiProvider: FilterAPIProvider) => {
  const {
    containerState: {
      value,
      updateAt,
      getAt,
      removeAt,
      createAndRemoveEmpty,
      create,
      exist,
      updateBySlug,
    },
  } = useConditionalFilterContext();
  const optionFetchGeneration = useRef<Record<string, number>>({});
  const addEmpty = () => {
    createAndRemoveEmpty(FilterElement.createEmpty());
  };
  const updateLeftOperator = (position: string, leftOperator: LeftOperand) => {
    const current = getAt(position);
    const dependency = Constraint.getDependency(leftOperator.value);
    const currentDependency =
      FilterElement.isFilterElement(current) && Constraint.getDependency(current.value.value);

    const selfConstraint = Constraint.fromSlug(leftOperator.value);
    const hasDependentFilters =
      !!selfConstraint &&
      value.some(row => {
        if (!FilterElement.isFilterElement(row)) return false;

        if (FilterElement.isFilterElement(current) && row.equals(current)) return false;

        return selfConstraint.dependsOn.includes(row.value.value);
      });

    updateAt(position, el => el.updateLeftOperator(leftOperator));

    if (selfConstraint && !hasDependentFilters) {
      updateAt(position, el => el.clearConstraint());
    }

    if (currentDependency && !dependency) {
      updateBySlug(currentDependency, el => {
        el.clearConstraint();
      });

      return;
    }

    if (!dependency) return;

    if (!exist(dependency)) {
      create(FilterElement.createStaticBySlug(dependency));

      return;
    }

    updateBySlug(dependency, el => {
      const newConstraint = Constraint.fromSlug(dependency);

      if (newConstraint) el.setConstraint(newConstraint);
    });
  };
  const updateAttribute = (position: string, attribute: LeftOperand) => {
    updateAt(position, el => {
      el.updateSelectedAttribute(attribute);

      const options = ConditionOptions.fromName(attribute.type);
      const selected = ConditionSelected.fromConditionItem(options.first());

      selected.enableLoading();
      el.condition = new Condition(options, selected, false);
    });
    fetchRightOptionsList(position, "");
  };
  const updateRightOperator = (position: string, rightOperator: ConditionValue) => {
    updateAt(position, el => el.updateRightOperator(rightOperator));
  };
  const updateRightLoadingState = (position: string, loading: boolean) => {
    updateAt(position, el => el.updateRightLoadingState(loading));
  };
  const updateCondition = (position: string, conditionValue: any) => {
    updateAt(position, el => el.updateCondition(conditionValue));
  };
  const _fetchRightOptions = async (position: string, inputValue: string) => {
    const fetchKey = `right:${position}`;
    const generation = nextFetchGeneration(optionFetchGeneration, fetchKey);

    updateRightLoadingState(position, true);

    try {
      const options = await apiProvider.fetchRightOptions(position, value, inputValue);

      if (optionFetchGeneration.current[fetchKey] !== generation) {
        return;
      }

      updateAt(position, el => {
        el.updateRightOptions(options);
        el.updateRightLoadingState(false);
      });
    } catch (error) {
      if (optionFetchGeneration.current[fetchKey] !== generation) {
        return;
      }

      captureFilterFetchError(error);
      updateRightLoadingState(position, false);
    }
  };
  const fetchRightOptionsList = (position: string, inputValue: string) => {
    void _fetchRightOptions(position, inputValue);
  };
  const debouncedFetchRightOptions = useDebounce(_fetchRightOptions, 500);
  const updateRightOptions = (position: string, inputValue: string) => {
    updateRightLoadingState(position, true);
    debouncedFetchRightOptions(position, inputValue);
  };

  const _fetchAttributesList = async (position: string, inputValue: string) => {
    const fetchKey = `attribute:${position}`;
    const generation = nextFetchGeneration(optionFetchGeneration, fetchKey);

    updateAt(position, el => el.updateAttributeLoadingState(true));

    try {
      const options = await apiProvider.fetchAttributeOptions(inputValue);

      if (optionFetchGeneration.current[fetchKey] !== generation) {
        return;
      }

      updateAt(position, el => {
        el.updateAvailableAttributesList(options as LeftOperand[]);
        el.updateAttributeLoadingState(false);
      });
    } catch (error) {
      if (optionFetchGeneration.current[fetchKey] !== generation) {
        return;
      }

      captureFilterFetchError(error);
      updateAt(position, el => el.updateAttributeLoadingState(false));
    }
  };
  const fetchAvailableAttributesList = (position: string, inputValue: string) => {
    void _fetchAttributesList(position, inputValue);
  };
  const debouncedFetchAvailableAttributesList = useDebounce(_fetchAttributesList, 500);
  const updateAvailableAttributesList = (position: string, inputValue: string) => {
    updateAt(position, el => el.updateAttributeLoadingState(true));
    debouncedFetchAvailableAttributesList(position, inputValue);
  };

  return {
    value,
    hasEmptyRows: hasEmptyRows(value),
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateAttribute,
    updateRightOperator,
    updateCondition,
    updateRightOptions,
    fetchRightOptionsList,
    fetchAvailableAttributesList,
    updateAvailableAttributesList,
  };
};
