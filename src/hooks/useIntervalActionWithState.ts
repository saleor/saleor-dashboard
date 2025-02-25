import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useEffect, useRef } from "react";

type Timeout = ReturnType<typeof setTimeout>;

export const useIntervalActionWithState = (action: () => void, interval = 5_000, key: string) => {
  const savedAction = useRef(action);
  const timeout = useRef<Timeout | null>(null);
  const [lastInvocation, setLastInvocation] = useLocalStorage(key, new Date(Date.now()).getTime());

  useEffect(() => {
    const cleanup = () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };

    const timeNow = new Date().getTime();
    const timePassed = timeNow - lastInvocation;
    const nextDelay = Math.max(0, interval - timePassed);

    const hasPassedInterval = timePassed >= interval;

    const action = () => {
      savedAction.current();
      setLastInvocation(new Date().getTime());
    };

    if (hasPassedInterval) {
      action();
      timeout.current = setTimeout(() => action(), interval);
    } else {
      timeout.current = setTimeout(() => action(), nextDelay);
    }

    return cleanup;
  }, [lastInvocation, action, interval, key, setLastInvocation]);
};
