import { renderHook } from "@testing-library/react-hooks";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";
import React from "react";

import { useFlagsmithFlag } from "./useFlagsmithFlag";

const wrapper = ({ children }) => (
  <FlagsmithProvider
    flagsmith={flagsmith}
    options={{ environmentID: "MY_ENV_ID" }}
  >
    {children}
  </FlagsmithProvider>
);

describe("useFlagsmithFlag hook", () => {
  test("should return flag detail when exists", () => {
    // Arrange && Act
    const features = {
      flag_one: "1",
    };

    jest.spyOn(flagsmith, "hasFeature").mockImplementation(v => !!features[v]);
    jest.spyOn(flagsmith, "getValue").mockImplementation(v => features[v]);

    const { result } = renderHook(() => useFlagsmithFlag("flagOne"), {
      wrapper,
    });

    // Assert
    expect(result.current).toEqual({
      enabled: true,
      value: "1",
    });
  });

  test("should return default flag details when flag does not exist", () => {
    // Arrange && Act
    const features = {};

    jest.spyOn(flagsmith, "hasFeature").mockImplementation(v => !!features[v]);
    jest.spyOn(flagsmith, "getValue").mockImplementation(v => features[v]);

    const { result } = renderHook(() => useFlagsmithFlag("flagOne"), {
      wrapper,
    });

    // Assert
    expect(result.current).toEqual({
      enabled: false,
      value: "",
    });
  });
});
