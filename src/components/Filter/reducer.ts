import { update } from "@saleor/utils/lists";
import { IFilter, IFilterElementMutableData } from "./types";

export type FilterReducerActionType =
  | "clear"
  | "merge"
  | "reset"
  | "set-property";
export interface FilterReducerAction<T extends string> {
  type: FilterReducerActionType;
  payload: Partial<{
    name: T;
    update: Partial<IFilterElementMutableData>;
    new: IFilter<T>;
  }>;
}

function merge<T extends string>(
  prevState: IFilter<T>,
  newState: IFilter<T>
): IFilter<T> {
  return newState.map(newFilter => {
    const prevFilter = prevState.find(
      prevFilter => prevFilter.name === newFilter.name
    );
    if (!!prevFilter) {
      return {
        ...newFilter,
        active: prevFilter.active,
        value: prevFilter.value
      };
    }

    return newFilter;
  });
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
    case "set-property":
      return setProperty(prevState, action.payload.name, action.payload.update);
    case "merge":
      return merge(prevState, action.payload.new);
    case "reset":
      return action.payload.new;

    default:
      return prevState;
  }
}

export default reduceFilter;
