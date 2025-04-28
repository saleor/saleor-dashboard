import { MANIFEST_ATTR } from "@dashboard/extensions/urls";
import { renderHook } from "@testing-library/react-hooks";

import { useLoadQueryParamsToForm } from "./useLoadQueryParamsToForm";

describe("useLoadQueryParamsToForm", () => {
  // Arrange
  const mockTrigger = jest.fn().mockResolvedValue(undefined);
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not trigger form submission when manifest param is not present", () => {
    // Arrange
    const params = {};

    // Act
    renderHook(() =>
      useLoadQueryParamsToForm({
        trigger: mockTrigger,
        onSubmit: mockOnSubmit,
        params,
      }),
    );

    // Assert
    expect(mockTrigger).not.toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("should trigger form valiadtion and submission when manifest param is present", async () => {
    // Arrange
    const params = {
      [MANIFEST_ATTR]: "test-manifest",
    };

    // Act
    renderHook(() =>
      useLoadQueryParamsToForm({
        trigger: mockTrigger,
        onSubmit: mockOnSubmit,
        params,
      }),
    );

    // Assert
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for next tick
    expect(mockTrigger).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("should only execute once on initial render even with different params", async () => {
    // Arrange
    const params = {
      [MANIFEST_ATTR]: "test-manifest",
    };

    // Act
    const { rerender } = renderHook(
      ({ currentParams }) =>
        useLoadQueryParamsToForm({
          trigger: mockTrigger,
          onSubmit: mockOnSubmit,
          params: currentParams,
        }),
      { initialProps: { currentParams: params } },
    );

    // Assert
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for next tick
    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    // Act - rerender with different params
    rerender({
      currentParams: {
        [MANIFEST_ATTR]: "different-manifest",
      },
    });

    // Assert - should not call again despite different params
    expect(mockTrigger).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
