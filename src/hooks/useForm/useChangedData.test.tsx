import { act, renderHook } from "@testing-library/react";

import { useChangedData } from "./useChangedData";

describe("useForm / useChangedData", () => {
  it("returns all changed fields that still differ from initial", () => {
    // Arrange
    const initial = {
      "field-1": "value-1",
      "field-2": "value-2",
      "field-3": "value-3",
      "field-4": "value-4",
    };
    const { result, rerender } = renderHook(({ formData }) => useChangedData(formData, initial), {
      initialProps: { formData: initial },
    });

    // Act
    act(() => {
      result.current.add("field-1");
      result.current.add("field-2");
    });
    rerender({
      formData: {
        ...initial,
        "field-1": "changed-1",
        "field-2": "changed-2",
      },
    });

    // Assert
    expect(result.current.data).toEqual({
      "field-1": "changed-1",
      "field-2": "changed-2",
    });
  });

  it("drops a field once its value matches initial again", () => {
    // Arrange
    const initial = {
      name: "Original",
      slug: "original",
    };
    const { result, rerender } = renderHook(({ formData }) => useChangedData(formData, initial), {
      initialProps: { formData: initial },
    });

    // Act — edit then revert
    act(() => {
      result.current.add("name");
    });
    rerender({ formData: { ...initial, name: "Edited" } });
    expect(result.current.data).toEqual({ name: "Edited" });

    rerender({ formData: initial });

    // Assert
    expect(result.current.data).toEqual({});
  });

  it("clears changed fields", () => {
    // Arrange
    const initial = {
      "field-1": "value-1",
      "field-2": "value-2",
      "field-3": "value-3",
      "field-4": "value-4",
    };
    const { result, rerender } = renderHook(({ formData }) => useChangedData(formData, initial), {
      initialProps: {
        formData: { ...initial, "field-1": "changed" },
      },
    });

    // Act
    act(() => {
      result.current.add("field-1");
    });
    rerender({ formData: { ...initial, "field-1": "changed" } });
    act(() => {
      result.current.clean();
    });

    // Assert
    expect(result.current.data).toEqual({});
  });
});
