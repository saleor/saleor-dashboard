import { type ProductMediaFragment, ProductMediaType } from "@dashboard/graphql";
import { act, renderHook } from "@testing-library/react";

import { useProductMediaDrag } from "./useProductMediaDrag";

const media: ProductMediaFragment[] = [
  {
    __typename: "ProductMedia",
    id: "a",
    alt: "",
    sortOrder: 0,
    type: ProductMediaType.IMAGE,
    url: "https://example.com/a.png",
    oembedData: "{}",
  },
  {
    __typename: "ProductMedia",
    id: "b",
    alt: "",
    sortOrder: 1,
    type: ProductMediaType.IMAGE,
    url: "https://example.com/b.png",
    oembedData: "{}",
  },
  {
    __typename: "ProductMedia",
    id: "c",
    alt: "",
    sortOrder: 2,
    type: ProductMediaType.IMAGE,
    url: "https://example.com/c.png",
    oembedData: "{}",
  },
];

describe("useProductMediaDrag", () => {
  it("reorders locally on drag over and commits indices on drag end", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result } = renderHook(() => useProductMediaDrag({ media, onReorder }));

    // Act — start dragging "a", move over "c"
    act(() => {
      result.current.handleDragStart({
        active: { id: "a" },
      } as never);
    });
    act(() => {
      result.current.handleDragOver({
        active: { id: "a" },
        over: { id: "c" },
      } as never);
    });

    // Assert — local order updated for live feedback
    expect(result.current.orderedMedia.map(item => item.id)).toEqual(["b", "c", "a"]);

    // Act
    act(() => {
      result.current.handleDragEnd({} as never);
    });

    // Assert — single mutation with indices relative to drag-start order
    expect(onReorder).toHaveBeenCalledWith({ oldIndex: 0, newIndex: 2 });
    expect(result.current.activeId).toBeNull();
  });

  it("restores prop order on drag cancel", () => {
    // Arrange
    const { result } = renderHook(() => useProductMediaDrag({ media }));

    act(() => {
      result.current.handleDragStart({
        active: { id: "a" },
      } as never);
    });
    act(() => {
      result.current.handleDragOver({
        active: { id: "a" },
        over: { id: "b" },
      } as never);
    });

    // Act
    act(() => {
      result.current.handleDragCancel();
    });

    // Assert
    expect(result.current.orderedMedia.map(item => item.id)).toEqual(["a", "b", "c"]);
    expect(result.current.activeId).toBeNull();
  });

  it("does not commit reorder when media changed during the drag", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result, rerender } = renderHook(
      ({ media: nextMedia }) => useProductMediaDrag({ media: nextMedia, onReorder }),
      { initialProps: { media } },
    );

    act(() => {
      result.current.handleDragStart({
        active: { id: "a" },
      } as never);
    });
    act(() => {
      result.current.handleDragOver({
        active: { id: "a" },
        over: { id: "c" },
      } as never);
    });

    // Act — upload completed while dragging
    const mediaWithUpload: ProductMediaFragment[] = [
      ...media,
      {
        __typename: "ProductMedia",
        id: "d",
        alt: "",
        sortOrder: 3,
        type: ProductMediaType.IMAGE,
        url: "https://example.com/d.png",
        oembedData: "{}",
      },
    ];

    rerender({ media: mediaWithUpload });

    act(() => {
      result.current.handleDragEnd({} as never);
    });

    // Assert
    expect(onReorder).not.toHaveBeenCalled();
    expect(result.current.orderedMedia.map(item => item.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("commits indices relative to the live media list", () => {
    // Arrange
    const onReorder = jest.fn();
    const { result } = renderHook(() => useProductMediaDrag({ media, onReorder }));

    act(() => {
      result.current.handleDragStart({
        active: { id: "c" },
      } as never);
    });
    act(() => {
      result.current.handleDragOver({
        active: { id: "c" },
        over: { id: "a" },
      } as never);
    });

    // Act
    act(() => {
      result.current.handleDragEnd({} as never);
    });

    // Assert — c moved from index 2 to 0 against current media order
    expect(onReorder).toHaveBeenCalledWith({ oldIndex: 2, newIndex: 0 });
  });
});
