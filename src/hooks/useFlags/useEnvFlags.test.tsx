import { renderHook } from "@testing-library/react-hooks";

import { useEnvFlags } from "./useEnvFlags";

describe("useEnvFlags hook", () => {
  const oldEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldEnv };
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  test("useEnvFlags should return results for given flags when exists in process.env", () => {
    // Arrange && Act
    process.env.FF_FLAG1 = "1";
    process.env.FF_FLAG2 = "2";

    const { result } = renderHook(() => useEnvFlags(["flag1", "flag2"]));

    // Assert
    expect(result.current).toEqual({
      flag1: {
        enabled: true,
        value: "1",
      },
      flag2: {
        enabled: true,
        value: "2",
      },
    });
  });

  test("useEnvFlags should return results for given flags even when flag does not exist", () => {
    // Arrange && Act
    const { result } = renderHook(() => useEnvFlags(["flag1", "flag2"]));

    // Assert
    expect(result.current).toEqual({
      flag1: {
        enabled: false,
        value: "",
      },
      flag2: {
        enabled: false,
        value: "",
      },
    });
  });

  test("should return empty object when not flags provided", () => {
    // Arrange && Act
    const { result } = renderHook(() => useEnvFlags([]));

    // Assert
    expect(result.current).toEqual({});
  });
});
