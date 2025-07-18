import { DragStartEvent } from "@dnd-kit/core";
import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useActiveDragId } from "./useActiveDragId";

describe("useActiveDragId", () => {
  it("should initialize with activeId as null", () => {
    // Arrange
    const { result } = renderHook(() => useActiveDragId());

    // Assert
    expect(result.current.activeId).toBeNull();
  });

  it("should set activeId when user starts dragging element", () => {
    // Arrange
    const { result } = renderHook(() => useActiveDragId());
    const event = {
      active: {
        id: "test-id",
      },
    } as DragStartEvent;

    // Act
    act(() => {
      result.current.handleDragStart(event);
    });

    // Assert
    expect(result.current.activeId).toBe("test-id");
  });

  it("should set activeId to null when user stops dragging element", () => {
    // Arrange
    const { result } = renderHook(() => useActiveDragId());
    const event = {
      active: {
        id: "test-id",
      },
    } as DragStartEvent;

    // Act
    act(() => {
      result.current.handleDragStart(event);
    });
    act(() => {
      result.current.handleDragEnd();
    });

    // Assert
    expect(result.current.activeId).toBeNull();
  });
});
