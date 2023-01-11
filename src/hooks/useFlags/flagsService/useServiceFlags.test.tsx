import { renderHook } from "@testing-library/react-hooks";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";
import React from "react";

import { useServicehFlags } from "./useServiceFlags";

const wrapper = ({ children }) => (
  <FlagsmithProvider
    flagsmith={flagsmith}
    options={{ environmentID: "MY_ENV_ID" }}
  >
    {children}
  </FlagsmithProvider>
);

describe("useServicehFlags", () => {
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
      () => useServicehFlags(["flagOne", "flag_two"]),
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
      () => useServicehFlags(["flagOne", "flagTwo"]),
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
    const { result } = renderHook(() => useServicehFlags([]), {
      wrapper,
    });

    // Assert
    expect(result.current).toEqual({});
  });
});
