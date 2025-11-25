import useDebounce from "@dashboard/hooks/useDebounce";

import { FilterAPIProvider } from "./API/FilterAPIProvider";
import { useConditionalFilterContext } from "./context";
import { FilterElement } from "./FilterElement";
import { Condition } from "./FilterElement/Condition";
import { ConditionOptions } from "./FilterElement/ConditionOptions";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import { ConditionValue, ItemOption } from "./FilterElement/ConditionValue";
import { Constraint } from "./FilterElement/Constraint";
import { hasEmptyRows } from "./FilterElement/FilterElement";
import { LeftOperand } from "./LeftOperandsProvider";

export const useFilterContainer = (apiProvider: FilterAPIProvider) => {
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
      FilterElement.isFilterElement(current) && Constraint.getDependency(current.value.value);

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
  const updateAttribute = (position: string, attribute: LeftOperand) => {
    updateAt(position, el => {
      el.updateSelectedAttribute(attribute);

      const options = ConditionOptions.fromName(attribute.type);
      const selected = ConditionSelected.fromConditionItem(options.first());

      selected.enableLoading();
      el.condition = new Condition(options, selected, false);
    });
    updateRightOptions(position, "");
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

  const _fetchAttributesList = async (position: string, inputValue: string) => {
    updateAt(position, el => el.updateAttributeLoadingState(true));

    const options = await apiProvider.fetchAttributeOptions(inputValue);

    updateAt(position, el => {
      el.updateAvailableAttributesList(options as LeftOperand[]);
      el.updateAttributeLoadingState(false);
    });
  };
  const updateAvailableAttributesList = useDebounce(_fetchAttributesList, 500);

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
    updateAvailableAttributesList,
  };
};
