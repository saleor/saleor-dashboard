import { FilterContainer } from "./FilterElement";
import { ConditionValue, ItemOption } from "./FilterElement/ConditionValue";
import { useContainerState } from "./useContainerState";

export const useFilterContainer = (initialValue: FilterContainer) => {
  const { value, updateAt, removeAt, createEmpty } = useContainerState(initialValue)

  const addEmpty = () => {
    createEmpty()
  };

  const updateLeftOperator = (position: string, leftOperator: any) => {
    updateAt(position, (el) => el.updateLeftOperator(leftOperator))
  };

  const updateLeftLoadingState = (position: string, loading: boolean) => {
    updateAt(position, (el) => el.updateLeftLoadingState(loading))
  };

  const updateRightOperator = (position: string, rightOperator: ConditionValue) => {
    updateAt(position, (el) => el.updateRightOperator(rightOperator))
  };

  const updateRightOptions = (position: string, options: ItemOption[]) => {
    updateAt(position, (el) => el.updateRightOptions(options))
  };

  const updateRightLoadingState = (position: string, loading: boolean) => {
    updateAt(position, (el) => el.updateRightLoadingState(loading))
  };

  const updateCondition = (position: string, conditionValue: any) => {
    updateAt(position, (el) => el.updateCondition(conditionValue))
  };

  return {
    value,
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition,
    updateRightOptions,
    updateRightLoadingState,
    updateLeftLoadingState,
  };
};
