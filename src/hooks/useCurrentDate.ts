import { useEffect, useState } from "react";

export function useCurrentDate(refreshInterval = 10_000): number {
  const [currentDate, setCurrentDate] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDate(Date.now());
    }, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshInterval]);

  return currentDate;
}
