import type { DragEndEvent } from "@dnd-kit/core";
import { act, renderHook } from "@testing-library/react";

import { type Product } from "./types";
import { useProductDrag } from "./useProductDrag";
import { useProductReorder } from "./useProductReorder";

const suppressClickAfterDrag = jest.fn();

jest.mock("@dnd-kit/core");
jest.mock("./useProductReorder");
jest.mock("@dashboard/hooks/useSuppressClickAfterDrag", () => ({
  useSuppressClickAfterDrag: (): (() => void) => suppressClickAfterDrag,
}));

describe("CollectionProducts/useProductDrag", () => {
  const initialProducts = [
    { id: "1", name: "Product 1" },
    { id: "2", name: "Product 2" },
    { id: "3", name: "Product 3" },
  ] as Product[];

  beforeEach(() => {
    suppressClickAfterDrag.mockClear();
  });

  it("should reorder items on drag end", () => {
    // Arrange
    const move = jest.fn();

    (useProductReorder as jest.Mock).mockReturnValue({
      move,
      data: { loading: false },
    });

    const { result } = renderHook(() =>
      useProductDrag({ products: initialProducts, paginationState: { first: 10, after: "1" } }),
    );

    const dragEndEvent = {
      active: { id: "1" },
      over: { id: "2" },
    } as DragEndEvent;

    // Act
    act(() => {
      result.current.handleDragEnd(dragEndEvent);
    });

    // Assert
    expect(result.current.items).toEqual([
      { id: "2", name: "Product 2" },
      { id: "1", name: "Product 1" },
      { id: "3", name: "Product 3" },
    ]);

    expect(move).toHaveBeenCalledWith(
      [
        { id: "2", name: "Product 2" },
        { id: "1", name: "Product 1" },
        { id: "3", name: "Product 3" },
      ],
      "1",
      -1,
    );
    expect(suppressClickAfterDrag).toHaveBeenCalledTimes(1);
  });

  it("should suppress the following click when a drag is cancelled", () => {
    // Arrange
    (useProductReorder as jest.Mock).mockReturnValue({
      move: jest.fn(),
      data: { loading: false },
    });

    const { result } = renderHook(() =>
      useProductDrag({ products: initialProducts, paginationState: { first: 10, after: "1" } }),
    );

    // Act
    act(() => {
      result.current.handleDragCancel();
    });

    // Assert
    expect(suppressClickAfterDrag).toHaveBeenCalledTimes(1);
  });
});
