import isEqual from "lodash/isEqual";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface UseStateFromPropsOpts<T> {
  mergeFunc?: (prevData: T, state: T, newData: T) => T;
  /**
   * Change it to replace the state with `data` as is, even when `data` didn't change,
   * e.g. after a save, to drop drafts the server didn't keep.
   */
  resetKey?: string | number;
}
/**
 * useState, but resets state whenever `data` changes by *value*.
 *
 * The deep comparison is load-bearing, not an optimisation: most call sites pass
 * a freshly-built object or array (`users ?? []`, `getChoices(...)`, an inline
 * literal). A reference-equality version resets state on every render at those
 * sites, which is an infinite render loop. Don't "simplify" it to
 * `useEffect(() => setState(data), [data])`.
 */
function useStateFromProps<T>(
  data: T,
  opts: UseStateFromPropsOpts<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(data);
  const [prevData, setPrevData] = useState(data);
  const { mergeFunc, resetKey } = opts;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);

  // One effect for both cases, so a reset and a data change in the same render can't
  // overwrite each other.
  useEffect(
    function syncStateWithProps() {
      if (resetKey !== prevResetKey) {
        setState(data);
        setPrevData(data);
        setPrevResetKey(resetKey);

        return;
      }

      const shouldUpdate = !isEqual(prevData, data);

      if (shouldUpdate) {
        const newData = typeof mergeFunc === "function" ? mergeFunc(prevData, state, data) : data;

        setState(newData);
        setPrevData(data);
      }
    },
    [data, resetKey],
  );

  return [state, setState];
}

export default useStateFromProps;
