import useDebounce from "@dashboard/hooks/useDebounce";

import { FilterAPIProvider } from "./API/FilterAPIProvider";
import { FilterContainer } from "./FilterElement";
import { ConditionValue, ItemOption } from "./FilterElement/ConditionValue";
import { LeftOperandsProvider } from "./LeftOperandsProvider";
import { useContainerState } from "./useContainerState";

export const useFilterContainer = (
  initialValue: FilterContainer,
  apiProvider: FilterAPIProvider,
  leftOperandsProvider: LeftOperandsProvider,
) => {
  const { value, updateAt, removeAt, createEmpty } =
    useContainerState(initialValue);

  const addEmpty = () => {
    createEmpty();
  };

  const updateLeftOperator = (position: string, leftOperator: any) => {
    updateAt(position, el => el.updateLeftOperator(leftOperator));
  };

  const updateLeftLoadingState = (position: string, loading: boolean) => {
    updateAt(position, el => el.updateLeftLoadingState(loading));
  };

  const updateRightOperator = (
    position: string,
    rightOperator: ConditionValue,
  ) => {
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
    const options = await apiProvider.fetchRightOptions(
      position,
      value,
      inputValue,
    );
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
    addEmpty,
    removeAt,
    updateLeftOperator,
    updateRightOperator,
    updateCondition,
    updateRightOptions,
    updateLeftOptions,
  };
};
