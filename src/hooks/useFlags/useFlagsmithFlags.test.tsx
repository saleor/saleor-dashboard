import { renderHook } from "@testing-library/react-hooks";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";
import React from "react";

import { useFlagsmithFlags } from "./useFlagsmithFlags";

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
      flag1: "1",
      flag2: "2",
    };

    jest.spyOn(flagsmith, "hasFeature").mockImplementation(v => !!features[v]);
    jest.spyOn(flagsmith, "getValue").mockImplementation(v => features[v]);
    jest.spyOn(flagsmith, "getTrait").mockImplementation(() => "");

    const { result } = renderHook(() => useFlagsmithFlags(["flag1", "flag2"]), {
      wrapper,
    });

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

  test("should return default flag value when flag does not exist", () => {
    // Arrange && Act
    const features = {};

    jest.spyOn(flagsmith, "hasFeature").mockImplementation(v => !!features[v]);
    jest.spyOn(flagsmith, "getValue").mockImplementation(v => features[v]);
    jest.spyOn(flagsmith, "getTrait").mockImplementation(() => "");

    const { result } = renderHook(() => useFlagsmithFlags(["flag1", "flag2"]), {
      wrapper,
    });

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
    const { result } = renderHook(() => useFlagsmithFlags([]), {
      wrapper,
    });

    // Assert
    expect(result.current).toEqual({});
  });
});
