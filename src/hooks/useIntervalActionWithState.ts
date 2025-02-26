import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useEffect, useRef } from "react";

type Timeout = ReturnType<typeof setTimeout>;

interface UseIntervalActionWithState {
  action: () => void;
  key: string;
  interval?: number;
  skip?: boolean;
}

export const useIntervalActionWithState = ({
  action,
  key,
  interval = 5_000,
  skip = false,
}: UseIntervalActionWithState) => {
  const savedAction = useRef(action);
  const timeout = useRef<Timeout | null>(null);
  const [lastInvocation, setLastInvocation] = useLocalStorage(key, new Date().getTime());

  useEffect(() => {
    const cleanup = () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };

    if (skip) {
      return cleanup;
    }

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
  }, [lastInvocation, interval, key, setLastInvocation, skip]);
};
