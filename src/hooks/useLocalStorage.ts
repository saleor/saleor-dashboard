import { useState } from "react";

export type SetLocalStorageValue<T> = T | ((prevValue: T) => T);
export type SetLocalStorage<T> = (value: SetLocalStorageValue<T>) => void;
export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetLocalStorage<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    let result: T;
    try {
      const item = window.localStorage.getItem(key);
      result = item ? JSON.parse(item) : initialValue;
    } catch {
      result = initialValue;
    }

    return result;
  });

  const setValue = (value: SetLocalStorageValue<T>) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);

    try {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      console.warn(`Could not save ${key} to localStorage`);
    }
  };

  return [storedValue, setValue];
}
