import { renderHook } from "@testing-library/react-hooks";

import { useServiceFlags } from "./useServiceFlags";

describe("useServiceFlags", () => {
  test("should return flags with values", () => {
    // Arrange && Ac
    const { result } = renderHook(() => useServiceFlags(["flagOne", "flag_two"]));

    // Assert
    expect(result.current).toEqual({
      flagOne: {
        enabled: false,
        value: "",
      },
      flag_two: {
        enabled: false,
        value: "",
      },
    });
  });

  test("should return empty object when not flags provided", () => {
    // Arrange && Act
    const { result } = renderHook(() => useServiceFlags([]));

    // Assert
    expect(result.current).toEqual({});
  });
});
