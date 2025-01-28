import type { DragEndEvent } from "@dnd-kit/core";
import { act, renderHook } from "@testing-library/react-hooks";

import { Product } from "./types";
import { useProductDrag } from "./useProductDrag";
import { useProductReorder } from "./useProductReorder";

jest.mock("@dnd-kit/core");
jest.mock("./useProductReorder");

describe("CollectionProducts/useProductDrag", () => {
  const initialProducts = [
    { id: "1", name: "Product 1" },
    { id: "2", name: "Product 2" },
    { id: "3", name: "Product 3" },
  ] as Product[];

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
  });
});
