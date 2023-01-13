import { renderHook } from "@testing-library/react-hooks";

import { useServiceFlags } from "./useServiceFlags";

jest.mock("flagsmith/react", () => ({
  __esModule: true,
  useFlags: () => ({
    flag_one: {
      enabled: true,
      value: "1",
    },
    flag_two: {
      enabled: true,
      value: "2",
    },
  }),
}));

afterAll(() => {
  jest.clearAllMocks();
});

describe("useServiceFlags", () => {
  test("should return flags with values", () => {
    // Arrange && Ac
    const { result } = renderHook(() =>
      useServiceFlags(["flagOne", "flag_two"]),
    );

    // Assert
    expect(result.current).toEqual({
      flagOne: {
        enabled: true,
        value: "1",
      },
      flag_two: {
        enabled: true,
        value: "2",
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
