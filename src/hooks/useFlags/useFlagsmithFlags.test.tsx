import { renderHook } from "@testing-library/react-hooks";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";
import React from "react";

import { useAllFlagsmithFlags, useFlagsmithFlags } from "./useFlagsmithFlags";

const wrapper = ({ children }) => (
  <FlagsmithProvider
    flagsmith={flagsmith}
    options={{ environmentID: "MY_ENV_ID" }}
  >
    {children}
  </FlagsmithProvider>
);

describe("useFlagsmithFlags hook", () => {
  test("should return flags with values", () => {
    // Arrange && Act
    const features = {
      flag_one: "1",
      flag_two: "2",
    };

    jest.spyOn(flagsmith, "hasFeature").mockImplementation(v => !!features[v]);
    jest.spyOn(flagsmith, "getValue").mockImplementation(v => features[v]);
    jest.spyOn(flagsmith, "getTrait").mockImplementation(() => "");

    const { result } = renderHook(
      () => useFlagsmithFlags(["flagOne", "flag_two"]),
      {
        wrapper,
      },
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

  test("should return default flag value when flag does not exist", () => {
    // Arrange && Act
    const features = {};

    jest.spyOn(flagsmith, "hasFeature").mockImplementation(v => !!features[v]);
    jest.spyOn(flagsmith, "getValue").mockImplementation(v => features[v]);
    jest.spyOn(flagsmith, "getTrait").mockImplementation(() => "");

    const { result } = renderHook(
      () => useFlagsmithFlags(["flagOne", "flagTwo"]),
      {
        wrapper,
      },
    );

    // Assert
    expect(result.current).toEqual({
      flagOne: {
        enabled: false,
        value: "",
      },
      flagTwo: {
        enabled: false,
        value: "",
      },
    });
  });

  test("should return empty object when not flags provided", () => {
    // Arrange && Act
    const { result } = renderHook(() => useFlagsmithFlags([]), {
      wrapper,
    });

    // Assert
    expect(result.current).toEqual({});
  });
});

describe("useAllFlagsmithFlags hook", () => {
  test("should return all flags from Flagsmith", () => {
    // Arrange && Act
    const features = {
      flag_one: {
        value: "1",
        enabled: true,
      },
      flag_two: {
        value: "2",
        enabled: true,
      },
    };

    jest.spyOn(flagsmith, "getAllFlags").mockImplementation(() => features);

    const { result } = renderHook(() => useAllFlagsmithFlags(), {
      wrapper,
    });

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
    const features = {};

    jest.spyOn(flagsmith, "getAllFlags").mockImplementation(() => features);

    const { result } = renderHook(() => useAllFlagsmithFlags(), {
      wrapper,
    });

    // Assert
    expect(result.current).toEqual([]);
  });
});
