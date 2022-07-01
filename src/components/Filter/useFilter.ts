import { useEffect, useReducer } from "react";

import reduceFilter, { FilterReducerAction } from "./reducer";
import { FieldType, FilterElement, IFilter } from "./types";

export type FilterDispatchFunction<K extends string = string> = <
  T extends FieldType
>(
  value: FilterReducerAction<K, T>,
) => void;

export type UseFilter<K extends string> = [
  Array<FilterElement<K>>,
  FilterDispatchFunction<K>,
  () => void,
];

function getParsedInitialFilter<T extends string>(
  initialFilter: IFilter<T>,
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

function useFilter<K extends string>(initialFilter: IFilter<K>): UseFilter<K> {
  const parsedInitialFilter = getParsedInitialFilter(initialFilter);

  const [data, dispatchFilterAction] = useReducer<
    React.Reducer<IFilter<K>, FilterReducerAction<K, FieldType>>
  >(reduceFilter, parsedInitialFilter);

  const reset = () =>
    dispatchFilterAction({
      payload: {
        new: parsedInitialFilter.map(each => ({
          ...each,
          active: false,
          value: [],
        })),
      },
      type: "reset",
    });

  const refresh = () =>
    dispatchFilterAction({
      payload: {
        new: parsedInitialFilter,
      },
      type: "merge",
    });

  useEffect(refresh, [initialFilter]);

  return [data, dispatchFilterAction, reset];
}

export default useFilter;
