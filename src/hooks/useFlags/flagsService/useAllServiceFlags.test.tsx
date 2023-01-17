import { renderHook } from "@testing-library/react-hooks";

import { useAllServiceFlags } from "./useAllServiceFlags";

jest.mock("flagsmith/react", () => ({
  __esModule: true,
  useFlagsmith: () => ({
    getAllFlags: () => ({
      flag_one: {
        enabled: true,
        value: "1",
      },
      flag_two: {
        enabled: true,
        value: "2",
      },
    }),
  }),
}));

afterAll(() => {
  jest.clearAllMocks();
});

describe("useAllServiceFlags hook", () => {
  test("should return all flags from flag service", () => {
    // Arrange && Act
    const { result } = renderHook(() => useAllServiceFlags());

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
});
