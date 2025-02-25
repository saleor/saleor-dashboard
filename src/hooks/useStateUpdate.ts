import { Dispatch, SetStateAction, useEffect, useState } from "react";

/** useState, but updates state every time initial value changes. */
export function useStateUpdate<T>(data: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(data);

  useEffect(() => {
    setState(data);
  }, [data]);

  return [state, setState];
}
