import useDebounce from "@dashboard/hooks/useDebounce";
import { errorTracker } from "@dashboard/services/errorTracking";
import { useRef } from "react";

import { type FilterAPIProvider } from "./API/FilterAPIProvider";
import {
  appendUniqueOptions,
  createChoiceFetchState,
  hasSameChoiceQuery,
  isCurrentChoiceGeneration,
  startAppendChoiceFetch,
  startReplaceChoiceFetch,
} from "./API/filterChoicesPage";
import { useConditionalFilterContext } from "./context";
import { FilterElement } from "./FilterElement";
import { Condition } from "./FilterElement/Condition";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { type ConditionValue, isItemOption } from "./FilterElement/ConditionValue";
import { Constraint } from "./FilterElement/Constraint";
import { hasEmptyRows } from "./FilterElement/FilterElement";
import { type LeftOperand } from "./LeftOperandsProvider";

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
  const choiceSession = useRef(createChoiceFetchState());
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
  const applySelectedAttribute = (el: FilterElement, attribute: LeftOperand) => {
    el.updateSelectedAttribute(attribute);

    const options = ConditionOptions.fromName(attribute.type);
    const selected = ConditionSelected.fromConditionItem(options.first());

    selected.enableLoading();
    el.condition = new Condition(options, selected, false);
  };
  const updateAttribute = (position: string, attribute: LeftOperand) => {
    const current = getAt(position);

    if (FilterElement.isFilterElement(current)) {
      applySelectedAttribute(current, attribute);
    }

    updateAt(position, el => {
      if (el.selectedAttribute?.value !== attribute.slug) {
        applySelectedAttribute(el, attribute);
      }
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
  const invalidateChoiceSession = (fetchKey: string, inputValue: string) => {
    startReplaceChoiceFetch(choiceSession.current, fetchKey, inputValue);
  };
  const _fetchRightOptions = async (
    position: string,
    inputValue: string,
    after?: string | null,
  ) => {
    const fetchKey = `right:${position}`;
    const session = choiceSession.current;
    const isAppend = Boolean(after);
    const generation = isAppend
      ? startAppendChoiceFetch(session, fetchKey)
      : startReplaceChoiceFetch(session, fetchKey, inputValue);

    if (generation === null) {
      return;
    }

    updateRightLoadingState(position, true);

    try {
      const result = await apiProvider.fetchRightOptions(position, value, inputValue, after);

      if (!isCurrentChoiceGeneration(session, fetchKey, generation)) {
        return;
      }

      session.pageInfo[fetchKey] = result.pageInfo;
      updateAt(position, el => {
        const currentOptions = el.condition.selected.options.filter(isItemOption);
        const options = isAppend
          ? appendUniqueOptions(currentOptions, result.options)
          : result.options;

        el.updateRightOptions(options);
        el.updateRightLoadingState(false);
      });
    } catch (error) {
      if (!isCurrentChoiceGeneration(session, fetchKey, generation)) {
        return;
      }

      captureFilterFetchError(error);
      updateRightLoadingState(position, false);
    } finally {
      if (isAppend && isCurrentChoiceGeneration(session, fetchKey, generation)) {
        session.fetchMoreInFlight[fetchKey] = false;
      }
    }
  };
  const fetchRightOptionsList = (position: string, inputValue: string) => {
    void _fetchRightOptions(position, inputValue);
  };
  const fetchMoreRightOptions = (position: string) => {
    const fetchKey = `right:${position}`;
    const page = choiceSession.current.pageInfo[fetchKey];

    if (!page?.endCursor) {
      return;
    }

    void _fetchRightOptions(position, choiceSession.current.query[fetchKey] ?? "", page.endCursor);
  };
  const debouncedFetchRightOptions = useDebounce((position: string, inputValue: string) => {
    if (!hasSameChoiceQuery(choiceSession.current, `right:${position}`, inputValue)) {
      return;
    }

    void _fetchRightOptions(position, inputValue);
  }, 500);
  const updateRightOptions = (position: string, inputValue: string) => {
    const fetchKey = `right:${position}`;

    if (hasSameChoiceQuery(choiceSession.current, fetchKey, inputValue)) {
      return;
    }

    if (inputValue === "") {
      fetchRightOptionsList(position, "");

      return;
    }

    invalidateChoiceSession(fetchKey, inputValue);
    updateRightLoadingState(position, true);
    debouncedFetchRightOptions(position, inputValue);
  };

  const _fetchAttributesList = async (
    position: string,
    inputValue: string,
    after?: string | null,
  ) => {
    const fetchKey = `attribute:${position}`;
    const session = choiceSession.current;
    const isAppend = Boolean(after);
    const generation = isAppend
      ? startAppendChoiceFetch(session, fetchKey)
      : startReplaceChoiceFetch(session, fetchKey, inputValue);

    if (generation === null) {
      return;
    }

    updateAt(position, el => el.updateAttributeLoadingState(true));

    try {
      const result = await apiProvider.fetchAttributeOptions(inputValue, after);

      if (!isCurrentChoiceGeneration(session, fetchKey, generation)) {
        return;
      }

      session.pageInfo[fetchKey] = result.pageInfo;
      updateAt(position, el => {
        const options = isAppend
          ? appendUniqueOptions(el.availableAttributesList, result.options)
          : result.options;

        el.updateAvailableAttributesList(options);
        el.updateAttributeLoadingState(false);
      });
    } catch (error) {
      if (!isCurrentChoiceGeneration(session, fetchKey, generation)) {
        return;
      }

      captureFilterFetchError(error);
      updateAt(position, el => el.updateAttributeLoadingState(false));
    } finally {
      if (isAppend && isCurrentChoiceGeneration(session, fetchKey, generation)) {
        session.fetchMoreInFlight[fetchKey] = false;
      }
    }
  };
  const fetchAvailableAttributesList = (position: string, inputValue: string) => {
    void _fetchAttributesList(position, inputValue);
  };
  const fetchMoreAttributeOptions = (position: string) => {
    const fetchKey = `attribute:${position}`;
    const page = choiceSession.current.pageInfo[fetchKey];

    if (!page?.endCursor) {
      return;
    }

    void _fetchAttributesList(
      position,
      choiceSession.current.query[fetchKey] ?? "",
      page.endCursor,
    );
  };
  const debouncedFetchAvailableAttributesList = useDebounce(
    (position: string, inputValue: string) => {
      if (!hasSameChoiceQuery(choiceSession.current, `attribute:${position}`, inputValue)) {
        return;
      }

      void _fetchAttributesList(position, inputValue);
    },
    500,
  );
  const updateAvailableAttributesList = (position: string, inputValue: string) => {
    const fetchKey = `attribute:${position}`;

    if (hasSameChoiceQuery(choiceSession.current, fetchKey, inputValue)) {
      return;
    }

    if (inputValue === "") {
      fetchAvailableAttributesList(position, "");

      return;
    }

    invalidateChoiceSession(fetchKey, inputValue);
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
    fetchMoreRightOptions,
    fetchAvailableAttributesList,
    fetchMoreAttributeOptions,
    updateAvailableAttributesList,
  };
};
