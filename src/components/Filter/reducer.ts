import { update } from "@saleor/utils/lists";

import { FieldType, IFilter, IFilterElementMutableDataGeneric } from "./types";

export type FilterReducerActionType =
  | "clear"
  | "merge"
  | "reset"
  | "set-property";
export interface FilterReducerAction<K extends string, T extends FieldType> {
  type: FilterReducerActionType;
  payload: Partial<{
    name: K;
    update: Partial<IFilterElementMutableDataGeneric<T>>;
    new: IFilter<K, T>;
  }>;
}
export type UpdateStateFunction<K extends string = string> = <
  T extends FieldType
>(
  value: FilterReducerAction<K, T>,
) => void;

function merge<T extends string>(
  prevState: IFilter<T>,
  newState: IFilter<T>,
): IFilter<T> {
  return newState.map(newFilter => {
    const prevFilter = prevState.find(
      prevFilter => prevFilter.name === newFilter.name,
    );
    if (!!prevFilter) {
      return {
        ...newFilter,
        active: prevFilter.active,
        value: prevFilter.value,
      };
    }

    return newFilter;
  });
}

function setProperty<K extends string, T extends FieldType>(
  prevState: IFilter<K, T>,
  filter: K,
  updateData: Partial<IFilterElementMutableDataGeneric<T>>,
): IFilter<K> {
  const field = prevState.find(f => f.name === filter);
  const updatedField = {
    ...field,
    ...updateData,
  };

  return update(updatedField, prevState, (a, b) => a.name === b.name);
}

function reduceFilter<K extends string, T extends FieldType>(
  prevState: IFilter<K, T>,
  action: FilterReducerAction<K, T>,
): IFilter<K> {
  switch (action.type) {
    case "set-property":
      return setProperty<K, T>(
        prevState,
        action.payload.name,
        action.payload.update,
      );
    case "merge":
      return merge(prevState, action.payload.new);
    case "reset":
      return action.payload.new;

    default:
      return prevState;
  }
}

export default reduceFilter;
