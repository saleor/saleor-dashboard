import { renderHook } from "@testing-library/react-hooks";

import { useAllEnvFlags, useEnvFlags } from "./useEnvFlags";

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
    process.env.FF_FLAG_ONE = "1";
    process.env.FF_FLAG_TWO = "2";

    const { result } = renderHook(() => useEnvFlags(["flagOne", "flag_two"]));

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

  test("useEnvFlags should return results for given flags even when flag does not exist", () => {
    // Arrange && Act
    const { result } = renderHook(() => useEnvFlags(["flagOne", "flag_two"]));

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
    const { result } = renderHook(() => useEnvFlags([]));

    // Assert
    expect(result.current).toEqual({});
  });
});

describe("useAllEnvFlags hook", () => {
  const oldEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldEnv };
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  test("should return all environment flags", () => {
    // Arrange && Act
    process.env.FF_FLAG_ONE = "1";
    process.env.FF_FLAG_TWO = "2";

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
    const { result } = renderHook(() => useAllEnvFlags());

    // Assert
    expect(result.current).toEqual([]);
  });
});
