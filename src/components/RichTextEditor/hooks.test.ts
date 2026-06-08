import { renderHook } from "@testing-library/react";
import { type MutableRefObject } from "react";

import { useUpdateOnRerender } from "./hooks";

describe("useUpdateOnRerender", () => {
  const createRenderRef = (
    mockRender = jest.fn(),
  ): MutableRefObject<typeof mockRender | undefined> => ({
    current: mockRender,
  });

  it("should call render when defaultValue changes after initial render", () => {
    // Arrange
    const mockRender = jest.fn();
    const renderRef = createRenderRef(mockRender);

    const { rerender } = renderHook(
      ({ defaultValue, hasRendered, isEditorReady }) =>
        useUpdateOnRerender({ renderRef, defaultValue, hasRendered, isEditorReady }),
      {
        initialProps: {
          defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
          hasRendered: true,
          isEditorReady: true,
        },
      },
    );

    // Act
    rerender({
      defaultValue: { blocks: [{ type: "paragraph", data: { text: "Updated" } }] },
      hasRendered: true,
      isEditorReady: true,
    });

    // Assert
    expect(mockRender).toHaveBeenCalledWith({
      blocks: [{ type: "paragraph", data: { text: "Updated" } }],
    });
  });

  it("should not call render on initial sync when editor becomes ready", () => {
    // Arrange
    const mockRender = jest.fn();
    const renderRef = createRenderRef(mockRender);

    const { rerender } = renderHook(
      ({ defaultValue, hasRendered, isEditorReady }) =>
        useUpdateOnRerender({ renderRef, defaultValue, hasRendered, isEditorReady }),
      {
        initialProps: {
          defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
          hasRendered: false,
          isEditorReady: false,
        },
      },
    );

    // Act
    rerender({
      defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
      hasRendered: true,
      isEditorReady: true,
    });
    rerender({
      defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
      hasRendered: true,
      isEditorReady: true,
    });

    // Assert
    expect(mockRender).not.toHaveBeenCalled();
  });

  it("should not call render if hasRendered is false", () => {
    // Arrange
    const mockRender = jest.fn();
    const renderRef = createRenderRef(mockRender);

    const { rerender } = renderHook(
      ({ defaultValue, hasRendered, isEditorReady }) =>
        useUpdateOnRerender({ renderRef, defaultValue, hasRendered, isEditorReady }),
      {
        initialProps: {
          defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] },
          hasRendered: false,
          isEditorReady: true,
        },
      },
    );

    // Act
    rerender({
      defaultValue: { blocks: [{ type: "paragraph", data: { text: "Updated" } }] },
      hasRendered: false,
      isEditorReady: true,
    });

    // Assert
    expect(mockRender).not.toHaveBeenCalled();
  });

  it("should not call render when defaultValue is undefined", () => {
    // Arrange
    const mockRender = jest.fn();
    const renderRef = createRenderRef(mockRender);

    const { rerender } = renderHook(
      ({ defaultValue, hasRendered, isEditorReady }) =>
        useUpdateOnRerender({ renderRef, defaultValue, hasRendered, isEditorReady }),
      {
        initialProps: {
          defaultValue: { blocks: [{ type: "paragraph", data: { text: "Initial" } }] } as
            | { blocks: { type: string; data: { text: string } }[] }
            | undefined,
          hasRendered: true,
          isEditorReady: true,
        },
      },
    );

    // Act
    rerender({
      defaultValue: undefined,
      hasRendered: true,
      isEditorReady: true,
    });

    // Assert
    expect(mockRender).not.toHaveBeenCalled();
  });
});
