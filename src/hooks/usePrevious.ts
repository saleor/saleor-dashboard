import { useEffect, useRef } from "react";

export const useAllPrevious = <T>(data?: T | T[]): T[] => {
  const allData = useRef<T[]>([]);

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        allData.current = [...allData.current, ...data];
      } else {
        allData.current = [...allData.current, data];
      }
    }
  }, [data]);

  return allData.current;
};

export const usePrevous = <T>(data?: T): T => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = data;
  }, [data]);

  return ref.current;
};
