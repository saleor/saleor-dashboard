import { renderHook } from "@testing-library/react-hooks";

import useLocalStorage from "./useLocalStorage";

const key = "exampleKey";
const initialValue = "exampleValue";
const savedValue = "savedValue";
const numberValue = 12;
const objectValue = { foo: numberValue };
const booleanValue = true;
const postfix = "-test";

beforeEach(() => {
  localStorage.clear();
});

describe("useLocalStorage", () => {
  it("properly inits from value", () => {
    expect(localStorage.getItem(key)).toBe(null);

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toBe(initialValue);
  });

  it("omits initializing if value is found", () => {
    localStorage.setItem(key, savedValue);
    expect(localStorage.getItem(key)).toBe(savedValue);

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toBe(savedValue);
  });

  it("properly casts value to number", () => {
    localStorage.setItem(key, JSON.stringify(numberValue));

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toBe(numberValue);
  });

  it("properly casts value to boolean", () => {
    localStorage.setItem(key, JSON.stringify(booleanValue));

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toBe(booleanValue);
  });

  it("properly casts value to object", () => {
    localStorage.setItem(key, JSON.stringify(objectValue));

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toStrictEqual(objectValue);
  });

  it("properly inits from callback if value is not found", () => {
    const { result } = renderHook(() =>
      useLocalStorage(key, storedValue =>
        storedValue ? storedValue + postfix : initialValue,
      ),
    );

    expect(result.current[0]).toBe(initialValue);
  });

  it("properly inits from callback if value is found", () => {
    localStorage.setItem(key, savedValue);

    const { result } = renderHook(() =>
      useLocalStorage(key, storedValue =>
        storedValue ? storedValue + postfix : initialValue,
      ),
    );

    expect(result.current[0]).toBe(savedValue + postfix);
    expect(localStorage.getItem(key)).toBe(savedValue + postfix);
  });

  it("properly inits from callback if value is object", () => {
    localStorage.setItem(key, JSON.stringify(objectValue));

    const { result } = renderHook(() =>
      useLocalStorage(key, storedValue => {
        if (typeof storedValue === "object") {
          return {
            ...storedValue,
            bar: "baz",
          };
        }

        return objectValue;
      }),
    );

    const newValue = {
      foo: numberValue,
      bar: "baz",
    };
    expect(result.current[0]).toStrictEqual(newValue);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue));
  });
});
