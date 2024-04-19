import isEqual from "lodash/isEqual";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export interface UseStateFromPropsOpts<T> {
  mergeFunc?: (prevData: T, state: T, newData: T) => T;
  onRefresh?: (prevData: T, data: T) => void;
}
/**
 * @deprecated This function updates state every time initial
 * value changes, but uses deep comparisons to detect changes.
 * You're most likely looking for `useStateUpdate` instead.
 */
function useStateFromProps<T>(
  data: T,
  opts: UseStateFromPropsOpts<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(data);
  const [prevData, setPrevData] = useState(data);
  const { mergeFunc, onRefresh } = opts;

  useEffect(() => {
    const shouldUpdate = !isEqual(prevData, data);

    if (shouldUpdate) {
      const newData = typeof mergeFunc === "function" ? mergeFunc(prevData, state, data) : data;

      setState(newData);
      setPrevData(data);

      if (typeof onRefresh === "function") {
        onRefresh(data, newData);
      }
    }
  }, [data]);

  return [state, setState];
}

export default useStateFromProps;
