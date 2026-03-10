import { renderHook } from "@testing-library/react";

import { useStateEvents } from "./InputWrapper";

describe("useStateEvents", () => {
  it.each([
    { type: "text", value: "Hello", expected: true },
    { type: "number", value: "123", expected: true },
    { type: "text", value: undefined, expected: false },
    { type: "number", value: undefined, expected: false },
    { type: "date", value: "2021-01-01", expected: true },
    { type: "time", value: "12:00", expected: true },
    { type: "date", value: undefined, expected: true },
    { type: "time", value: undefined, expected: true },
  ] as const)(
    `should return typed=$expected if type is $type with value $value`,
    ({ type, value, expected }) => {
      const { result } = renderHook(() => useStateEvents(value, type));

      expect(result.current.typed).toBe(expected);
    }
  );
});
