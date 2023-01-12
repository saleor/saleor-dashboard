import { renderHook } from "@testing-library/react-hooks";

import { useAllEnvFlags } from "./useAllEnvFlags";

describe("useAllEnvFlags hook", () => {
  test("should return all environment flags", () => {
    // Arrange && Act
    global.FLAGS = {
      FF_FLAG_ONE: "1",
      FF_FLAG_TWO: "2",
    };

    const { result } = renderHook(() => useAllEnvFlags());

    // Assert
    expect(result.current).toEqual([
      {
        name: "flagOne",
        enabled: true,
        value: "1",
      },
      {
        name: "flagTwo",
        enabled: true,
        value: "2",
      },
    ]);
  });

  test("should return empty array when there is no flags", () => {
    // Arrange && Act
    global.FLAGS = {};

    const { result } = renderHook(() => useAllEnvFlags());

    // Assert
    expect(result.current).toEqual([]);
  });
});
