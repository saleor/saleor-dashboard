import { act, renderHook } from "@testing-library/react";

import { useAttributeCreateValues } from "./useAttributeCreateValues";

describe("useAttributeCreateValues", () => {
  it("deletes selected values by id", () => {
    // Arrange
    const { result } = renderHook(() => useAttributeCreateValues());

    act(() => {
      result.current.handleValueCreateMany([{ name: "Red" }, { name: "Green" }, { name: "Blue" }]);
    });

    // Act
    act(() => {
      result.current.deleteValuesByIds(["0", "2"]);
    });

    // Assert
    expect(result.current.values.map(value => value.name)).toEqual(["Green"]);
  });
});
