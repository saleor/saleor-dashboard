import { renderHook } from "@testing-library/react-hooks";

import { useEnvFlag } from "./useEnvFlag";

describe("useEnvFlags hook", () => {
  const oldEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldEnv };
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  test("should return flag detail when exists in process.env", () => {
    // Arrange && Act
    process.env.FF_FLAG_ONE = "1";

    const { result } = renderHook(() => useEnvFlag("flagOne"));

    // Assert
    expect(result.current).toEqual({
      enabled: true,
      value: "1",
    });
  });

  test("should return default flag details when flag does not exist in process.env", () => {
    // Arrange && Act
    const { result } = renderHook(() => useEnvFlag("flagOne"));

    // Assert
    expect(result.current).toEqual({
      enabled: false,
      value: "",
    });
  });
});
