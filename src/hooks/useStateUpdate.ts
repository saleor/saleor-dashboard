import React from "react";

/** useState, but updates state every time initial value changes. */
export function useStateUpdate<T>(data: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState(data);

  React.useEffect(() => {
    setState(data);
  }, [data]);

  return [state, setState];
}
