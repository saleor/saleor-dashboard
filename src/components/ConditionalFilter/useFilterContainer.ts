import useDebounce from "@dashboard/hooks/useDebounce";

import { FilterAPIProvider } from "./API/FilterAPIProvider";
import { useConditionalFilterContext } from "./context";
import { FilterElement } from "./FilterElement";
import { ConditionValue, ItemOption } from "./FilterElement/ConditionValue";
import { Constraint } from "./FilterElement/Constraint";
import { hasEmptyRows } from "./FilterElement/FilterElement";
import { LeftOperand, LeftOperandsProvider } from "./LeftOperandsProvider";

export const useFilterContainer = (
  apiProvider: FilterAPIProvider,
  leftOperandsProvider: LeftOperandsProvider,
) => {
  const {
    containerState: { value, updateAt, getAt, removeAt, createEmpty, create, exist, updateBySlug },
  } = useConditionalFilterContext();
  const addEmpty = () => {
    createEmpty();
  };
  const updateLeftOperator = (position: string, leftOperator: LeftOperand) => {
    const current = getAt(position);
    const dependency = Constraint.getDependency(leftOperator.value);
    const currentDependency =
      FilterElement.isCompatible(current) && Constraint.getDependency(current.value.value);

    updateAt(position, el => el.updateLeftOperator(leftOperator));

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
  const updateLeftLoadingState = (position: string, loading: boolean) => {
    updateAt(position, el => el.updateLeftLoadingState(loading));
  };
  const updateRightOperator = (position: string, rightOperator: ConditionValue) => {
    updateAt(position, el => el.updateRightOperator(rightOperator));
  };
  const _updateRightOptions = (position: string, options: ItemOption[]) => {
    updateAt(position, el => el.updateRightOptions(options));
  };
  const updateRightLoadingState = (position: string, loading: boolean) => {
    updateAt(position, el => el.updateRightLoadingState(loading));
  };
  const updateCondition = (position: string, conditionValue: any) => {
    updateAt(position, el => el.updateCondition(conditionValue));
  };
  const _fetchRightOptions = async (position: string, inputValue: string) => {
    updateRightLoadingState(position, true);

    const options = await apiProvider.fetchRightOptions(position, value, inputValue);

    updateRightLoadingState(position, false);
    _updateRightOptions(position, options);
  };
  const updateRightOptions = useDebounce(_fetchRightOptions, 500);
  const _fetchLeftOptions = async (position: string, inputValue: string) => {
    updateLeftLoadingState(position, true);

    const options = await apiProvider.fetchLeftOptions(inputValue);

    updateLeftLoadingState(position, false);
    leftOperandsProvider.setOperands(options);
  };
  const updateLeftOptions = useDebounce(_fetchLeftOptions, 500);

  return {
    value,
    hasEmptyRows: hasEmptyRows(value),
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition,
    updateRightOptions,
    updateLeftOptions,
  };
};
