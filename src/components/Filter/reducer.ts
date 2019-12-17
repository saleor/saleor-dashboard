import { update } from "@saleor/utils/lists";
import { IFilter, IFilterElementMutableData } from "./types";

export type FilterReducerActionType = "clear" | "reset" | "set-property";
export interface FilterReducerAction<T extends string> {
  type: FilterReducerActionType;
  payload: Partial<{
    name: T;
    update: Partial<IFilterElementMutableData>;
    reset: IFilter<T>;
  }>;
}

function setProperty<T extends string>(
  prevState: IFilter<T>,
  filter: T,
  updateData: Partial<IFilterElementMutableData>
): IFilter<T> {
  const field = prevState.find(f => f.name === filter);
  const updatedField = {
    ...field,
    ...updateData
  };

  return update(updatedField, prevState, (a, b) => a.name === b.name);
}

function reduceFilter<T extends string>(
  prevState: IFilter<T>,
  action: FilterReducerAction<T>
): IFilter<T> {
  switch (action.type) {
    case "clear":
      return prevState;
    case "set-property":
      return setProperty(prevState, action.payload.name, action.payload.update);
    case "reset":
      return action.payload.reset;
  }
  return prevState;
}

export default reduceFilter;
