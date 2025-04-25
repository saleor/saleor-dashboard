import { renderHook } from "@testing-library/react-hooks";

import { useUpdateOnRerender } from "./hooks";

describe("useUpdateOnRerender", () => {
  it("should call render when defaultValue changes after initial render", () => {
    // Arrange
    const mockRender = jest.fn();

    const { rerender } = renderHook(
      ({ render, defaultValue, hasRendered }) =>
        useUpdateOnRerender({ render, defaultValue, hasRendered }),
      {
        initialProps: {
          render: mockRender,
          defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
          hasRendered: true,
        },
      },
    );

    // Act
    rerender({
      render: mockRender,
      defaultValue: { blocks: [{ type: "paragraph", data: { text: "Updated" } }] },
      hasRendered: true,
    });

    // Assert
    expect(mockRender).toHaveBeenCalledWith({
      blocks: [{ type: "paragraph", data: { text: "Updated" } }],
    });
  });

  it("should call render once when defaultValue change", () => {
    // Arrange
    const mockRender = jest.fn();

    const { rerender } = renderHook(
      ({ render, defaultValue, hasRendered }) =>
        useUpdateOnRerender({ render, defaultValue, hasRendered }),
      {
        initialProps: {
          render: mockRender,
          defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
          hasRendered: false,
        },
      },
    );

    // Act
    rerender({
      render: mockRender,
      defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
      hasRendered: true,
    });
    rerender({
      render: mockRender,
      defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
      hasRendered: true,
    });

    // Assert
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it("should not call render if hasRendered is false", () => {
    // Arrange
    const mockRender = jest.fn();

    const { rerender } = renderHook(
      ({ render, defaultValue, hasRendered }) =>
        useUpdateOnRerender({ render, defaultValue, hasRendered }),
      {
        initialProps: {
          render: mockRender,
          defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
          hasRendered: false,
        },
      },
    );

    // Act
    rerender({
      render: mockRender,
      defaultValue: { blocks: [{ type: "paragraph", data: { text: "Updated" } }] },
      hasRendered: false,
    });

    // Assert
    expect(mockRender).not.toHaveBeenCalled();
  });
});
