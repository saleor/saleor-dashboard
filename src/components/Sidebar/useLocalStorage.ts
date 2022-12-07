// Copied directly from
// https://github.com/dance2die/react-use-localstorage/blob/master/src/index.ts
// to avoid cjs and esm confusion in jest transformators

import { useCallback, useEffect, useState } from "react";

import { isWindowDefined } from "./consts";

// FIXME: We also had to tweak return signature because tuples were bugging
// typescript parser
// https://stackoverflow.com/questions/62079477/line-0-parsing-error-cannot-read-property-map-of-undefined
// tsdx issue
// https://github.com/formium/tsdx/issues/926
export interface UseLocalStorage {
  value: string;
  setValue: (value: string) => void;
}
export default function useLocalStorage(
  key: string,
  initialValue: string = "",
): UseLocalStorage {
  const [value, setValue] = useState(
    () => (isWindowDefined && window.localStorage.getItem(key)) || initialValue,
  );

  const setItem = (newValue: string) => {
    setValue(newValue);
    if (isWindowDefined) {
      window.localStorage.setItem(key, newValue);
    }
  };

  useEffect(() => {
    if (isWindowDefined) {
      const newValue = window.localStorage.getItem(key);
      if (value !== newValue) {
        setValue(newValue || initialValue);
      }
    }
  });

  const handleStorage = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.newValue !== value) {
        setValue(event.newValue || initialValue);
      }
    },
    [value, key],
  );

  useEffect(() => {
    if (isWindowDefined) {
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
    return;
  }, [handleStorage]);

  return {
    value,
    setValue: setItem,
  };
}
