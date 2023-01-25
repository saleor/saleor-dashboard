import { renderHook } from "@testing-library/react-hooks";

import { useEnvFlags } from "./useEnvFlags";

describe("useEnvFlags hook", () => {
  afterEach(() => {
    delete FLAGS.FF_FLAG_ONE;
    delete FLAGS.FF_FLAG_TWO;
  });

  test("should return results for given flags when exists in process.env", () => {
    // Arrange && Act
    FLAGS.FF_FLAG_ONE = "1";
    FLAGS.FF_FLAG_TWO = "2";

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

  test("should return results for given flags even when flag does not exist", () => {
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

  test("should return array with disabled flags", () => {
    // Arrange && Act
    FLAGS.FF_FLAG_ONE = "";
    FLAGS.FF_FLAG_TWO = "false";

    const { result } = renderHook(() => useEnvFlags(["flagOne", "flag_two"]));

    // Assert
    expect(result.current).toEqual({
      flagOne: {
        enabled: false,
        value: "",
      },
      flag_two: {
        enabled: false,
        value: "false",
      },
    });
  });
});
