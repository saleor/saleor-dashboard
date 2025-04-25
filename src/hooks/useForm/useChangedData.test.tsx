import { renderHook } from "@testing-library/react-hooks";

import { useChangedData } from "./useChangedData";

describe("useForm / useChangedData", () => {
  it("returns all changed fields", () => {
    // Arrange
    const { result } = renderHook(() =>
      useChangedData({
        "field-1": "value-1",
        "field-2": "value-2",
        "field-3": "value-3",
        "field-4": "value-4",
      }),
    );

    // Act
    result.current.add("field-1");
    result.current.add("field-2");

    // Assert
    expect(result.current.data).toEqual({
      "field-1": "value-1",
      "field-2": "value-2",
    });
  });

  it("clears changed fields", () => {
    // Arrange
    const { result } = renderHook(() =>
      useChangedData({
        "field-1": "value-1",
        "field-2": "value-2",
        "field-3": "value-3",
        "field-4": "value-4",
      }),
    );

    // Act
    result.current.add("field-1");
    result.current.clean();

    // Assert
    expect(result.current.data).toEqual({});
  });
});
