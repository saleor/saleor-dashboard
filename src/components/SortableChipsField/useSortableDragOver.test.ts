import { DragOverEvent } from "@dnd-kit/core";
import { renderHook } from "@testing-library/react-hooks";

import { useSortableDragOver } from "./useSortableDragOver";

describe("useSortableDragOver", () => {
  const items = [
    { value: "1", label: "Item 1" },
    { value: "2", label: "Item 2" },
    { value: "3", label: "Item 3" },
  ];

  it("should call onReorder with correct indices when dragging over another item", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result } = renderHook(() => useSortableDragOver({ items, onReorder }));
    const event = {
      active: { id: "1" },
      over: { id: "3" },
    } as DragOverEvent;

    // Act
    result.current.handleDragOver(event);

    // Assert
    expect(onReorder).toHaveBeenCalledWith({ oldIndex: 0, newIndex: 2 });
  });

  it("should not call onReorder when dragging over the same item", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result } = renderHook(() => useSortableDragOver({ items, onReorder }));
    const event = {
      active: { id: "1" },
      over: { id: "1" },
    } as DragOverEvent;

    // Act
    result.current.handleDragOver(event);

    // Assert
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("should not call onReorder when dnd-kit cannot determine over which element user is hovering", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result } = renderHook(() => useSortableDragOver({ items, onReorder }));
    const event = {
      active: { id: "1" },
      over: null,
    } as DragOverEvent;

    // Act
    result.current.handleDragOver(event);

    // Assert
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("should not call onReorder when active item is not in the list", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result } = renderHook(() => useSortableDragOver({ items, onReorder }));
    const event = {
      active: { id: "4" }, // not in items
      over: { id: "1" },
    } as DragOverEvent;

    // Act
    result.current.handleDragOver(event);

    // Assert
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("should not call onReorder when over item is not in the list", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result } = renderHook(() => useSortableDragOver({ items, onReorder }));
    const event = {
      active: { id: "1" },
      over: { id: "4" }, // not in items
    } as DragOverEvent;

    // Act
    result.current.handleDragOver(event);

    // Assert
    expect(onReorder).not.toHaveBeenCalled();
  });
});
