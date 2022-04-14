import isEqual from "lodash/isEqual";
import {
  DependencyList,
  Dispatch,
  SetStateAction,
  useDebugValue,
  useEffect,
  useRef,
  useState
} from "react";

export interface UseStateFromPropsOpts<T> {
  mergeFunc?: (prevData: T, state: T, newData: T) => T;
  onRefresh?: (prevData: T, data: T) => void;
}

export function useDebugRenderCounter(
  deps?: DependencyList,
  name: string = ""
) {
  const counter = useRef(0);
  useDebugValue(
    name ? `${name} renders: ${counter.current}` : `renders: ${counter.current}`
  );

  useEffect(() => {
    counter.current++;
  }, deps);
}

function useStateFromProps<T>(
  data: T,
  opts: UseStateFromPropsOpts<T> = {}
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(data);
  const [prevData, setPrevData] = useState(data);
  const history = useRef([]);

  const { mergeFunc, onRefresh } = opts;

  useDebugRenderCounter(undefined, "all");
  useDebugRenderCounter([data], "data");

  // console.log("rerender", this?.debugName, prevData, data, shouldUpdate);

  useEffect(() => {
    const shouldUpdate = !isEqual(prevData, data);
    if (shouldUpdate) {
      // console.log("should update", this?.debugName, prevData, data);
      const newData =
        typeof mergeFunc === "function"
          ? mergeFunc(prevData, state, data)
          : data;

      history.current.push({ prevData, data, newData });
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
