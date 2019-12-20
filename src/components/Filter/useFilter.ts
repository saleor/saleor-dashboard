import { useReducer, useEffect, Dispatch } from "react";

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
        reset: initialFilter
      },
      type: "reset"
    });

  useEffect(reset, [initialFilter]);

  return [data, dispatchFilterAction, reset];
}

export default useFilter;
