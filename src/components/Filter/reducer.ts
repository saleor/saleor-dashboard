import { update } from "@dashboard/utils/lists";

import { FieldType, IFilter, IFilterElementMutableDataGeneric } from "./types";

type FilterReducerActionType = "clear" | "merge" | "reset" | "set-property";
export interface FilterReducerAction<K extends string, T extends FieldType> {
  type: FilterReducerActionType;
  payload: Partial<{
    name: K;
    update: Partial<IFilterElementMutableDataGeneric<T>>;
    new: IFilter<K, T>;
  }>;
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

  return update(updatedField, prevState as any, (a, b) => a.name === b.name) as any;
}

function reduceFilter<K extends string, T extends FieldType>(
  prevState: IFilter<K, T>,
  action: FilterReducerAction<K, T>,
): IFilter<K> {
  switch (action.type) {
    case "set-property":
      if (!action.payload.name || !action.payload.update) {
        return prevState;
      }

      return setProperty<K, T>(prevState, action.payload.name, action.payload.update);
    case "reset":
      if (!action.payload.new) {
        return prevState;
      }

      return action.payload.new as any;

    default:
      return prevState;
  }
}

export default reduceFilter;
