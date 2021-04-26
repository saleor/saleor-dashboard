import { Dispatch, useEffect, useReducer } from "react";

import reduceFilter, { FilterReducerAction } from "./reducer";
import { IFilter, IFilterElement } from "./types";

export type UseFilter<T extends string> = [
  Array<IFilterElement<T>>,
  Dispatch<FilterReducerAction<T>>,
  () => void
];

function getParsedInitialFilter<T extends string>(
  initialFilter: IFilter<T>
): IFilter<T> {
  return initialFilter.reduce((resultFilter, filterField) => {
    if (filterField.multipleFields) {
      return resultFilter
        .concat(filterField.multipleFields)
        .concat([filterField]);
    }

    return resultFilter.concat(filterField);
  }, []);
}

function useFilter<T extends string>(initialFilter: IFilter<T>): UseFilter<T> {
  const parsedInitialFilter = getParsedInitialFilter(initialFilter);

  const [data, dispatchFilterAction] = useReducer<
    React.Reducer<IFilter<T>, FilterReducerAction<T>>
  >(reduceFilter, parsedInitialFilter);

  const reset = () =>
    dispatchFilterAction({
      payload: {
        new: parsedInitialFilter.map(each => ({
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
        new: parsedInitialFilter
      },
      type: "merge"
    });

  useEffect(refresh, [initialFilter]);

  return [data, dispatchFilterAction, reset];
}

export default useFilter;
