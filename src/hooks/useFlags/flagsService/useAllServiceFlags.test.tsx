import { renderHook } from "@testing-library/react-hooks";
import flagsmith from "flagsmith";
import { FlagsmithProvider } from "flagsmith/react";
import React from "react";

import { useAllServiceFlags } from "./useAllServiceFlags";

const wrapper = ({ children }) => (
  <FlagsmithProvider
    flagsmith={flagsmith}
    options={{ environmentID: "MY_ENV_ID" }}
  >
    {children}
  </FlagsmithProvider>
);

describe("useAllServiceFlags hook", () => {
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

    const { result } = renderHook(() => useAllServiceFlags(), {
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

    const { result } = renderHook(() => useAllServiceFlags(), {
      wrapper,
    });

    // Assert
    expect(result.current).toEqual([]);
  });
});
