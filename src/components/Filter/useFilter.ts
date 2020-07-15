import { Dispatch, useEffect, useReducer } from "react";

import reduceFilter, { FilterReducerAction } from "./reducer";
import { IFilter, IFilterElement } from "./types";

export type UseFilter<T extends string> = [
  Array<IFilterElement<T>>,
  Dispatch<FilterReducerAction<T>>,
  () => void
];

function useFilter<T extends string>(initialFilter: IFilter<T>): UseFilter<T> {
  const [data, dispatchFilterAction] = useReducer<
    React.Reducer<IFilter<T>, FilterReducerAction<T>>
  >(reduceFilter, initialFilter);

  const reset = () =>
    dispatchFilterAction({
      payload: {
        new: initialFilter.map(each => ({
          ...each,
          active: false,
          value: []
        }))
      },
      type: "reset"
    });

  const refresh = () =>
    dispatchFilterAction({
      payload: {
        new: initialFilter
      },
      type: "merge"
    });

  useEffect(refresh, [initialFilter]);

  return [data, dispatchFilterAction, reset];
}

export default useFilter;
