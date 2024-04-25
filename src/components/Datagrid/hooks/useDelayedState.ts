import { useTheme } from "@saleor/macaw-ui";
import { useEffect, useState } from "react";

export const useDelayedState = (state: boolean) => {
  const {
    transitions: { duration },
  } = useTheme();
  const [delayedState, setDelayedState] = useState(state);

  useEffect(() => {
    const delay = state ? 0 : duration.standard;
    const timeout = setTimeout(() => {
      setDelayedState(state);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  return { delayedState, duration: duration.standard };
};
