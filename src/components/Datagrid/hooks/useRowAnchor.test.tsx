import { type GridMouseEventArgs } from "@glideapps/glide-data-grid";
import { render, renderHook } from "@testing-library/react";

import { useRowAnchor } from "./useRowAnchor";

jest.mock("@dashboard/hooks/useDebounce", () => jest.fn(fn => fn));

// jsdom exposes scrollX/scrollY as plain properties, so they are redefined rather than spied on.
const setPageScroll = (scrollX: number, scrollY: number) => {
  Object.defineProperty(window, "scrollX", { value: scrollX, configurable: true, writable: true });
  Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true, writable: true });
};

describe("useRowAnchor", () => {
  afterEach(() => {
    setPageScroll(0, 0);
  });

  const props = {
    availableColumns: [
      {
        id: "name",
        title: "Name",
        width: 200,
        icon: "arrowUp",
      },
      {
        id: "description",
        title: "Description",
        width: 100,
        icon: "arrowUp",
      },
    ],
    getRowAnchorUrl: () => "test",
    rowMarkers: "checkbox-visible" as const,
  };

  it("should return row anchor ref", () => {
    // Arrange & Act
    const { result } = renderHook(() => useRowAnchor(props));

    render(<a ref={result.current.setRowAnchorRef} />);

    // Assert
    expect(result.current.rowAnchorRef).toBeDefined();
  });
  it("should have anchor set", () => {
    // Arrange
    const { result } = renderHook(() => useRowAnchor(props));

    render(<a ref={result.current.setRowAnchorRef} />);

    // Act
    result.current.setAnchorPosition({
      kind: "cell",
      location: [1, 0],
      bounds: { x: 0, y: 0, width: 0, height: 0 },
      isEdge: false,
      shiftKey: false,
      ctrlKey: false,
      isFillHandle: false,
      metaKey: false,
      isTouch: false,
      localEventX: 81,
      localEventY: 39,
      button: 0,
      scrollEdge: [0, 0],
    });

    // Assert
    expect(result.current.rowAnchorRef.current!).not.toBeNull();
    expect(result.current.rowAnchorRef.current!.style.left).toBe("0px");
    expect(result.current.rowAnchorRef.current!.href).toBe("http://localhost/test");
  });
  it("should position the anchor over the hovered cell regardless of page scroll", () => {
    // Arrange - Glide reports cell bounds in viewport coordinates and the anchor is
    // positioned with `position: fixed`, so page scroll must not be added to them.
    setPageScroll(120, 340);

    const { result } = renderHook(() => useRowAnchor(props));

    render(<a ref={result.current.setRowAnchorRef} />);

    // Act
    result.current.setAnchorPosition({
      kind: "cell",
      location: [1, 0],
      bounds: { x: 200, y: 80, width: 240, height: 32 },
      isEdge: false,
      shiftKey: false,
      ctrlKey: false,
      isFillHandle: false,
      metaKey: false,
      isTouch: false,
      localEventX: 81,
      localEventY: 39,
      button: 0,
      scrollEdge: [0, 0],
    } as GridMouseEventArgs);

    // Assert
    const anchor = result.current.rowAnchorRef.current!;

    expect(anchor.style.left).toBe("200px");
    expect(anchor.style.top).toBe("80px");
    expect(anchor.style.width).toBe("240px");
    expect(anchor.style.height).toBe("32px");
  });
  it("should reveal the anchor again once a fresh hover repositions it", () => {
    // Arrange - scrolling hides the anchor because its target row moves out from under
    // the cursor, so the next hover has to bring it back.
    const { result } = renderHook(() => useRowAnchor(props));

    render(<a ref={result.current.setRowAnchorRef} />);

    result.current.rowAnchorRef.current!.style.display = "none";

    // Act
    result.current.setAnchorPosition({
      kind: "cell",
      location: [1, 0],
      bounds: { x: 10, y: 20, width: 100, height: 32 },
      isEdge: false,
      shiftKey: false,
      ctrlKey: false,
      isFillHandle: false,
      metaKey: false,
      isTouch: false,
      localEventX: 81,
      localEventY: 39,
      button: 0,
      scrollEdge: [0, 0],
    } as GridMouseEventArgs);

    // Assert
    expect(result.current.rowAnchorRef.current!.style.display).toBe("block");
  });
  it("should not set anchor position when cell has action", () => {
    // Arrange
    const { result } = renderHook(() =>
      useRowAnchor({
        ...props,
        availableColumns: [
          ...props.availableColumns,
          {
            id: "price",
            title: "Price",
            width: 100,
            icon: "arrowUp",
            action: jest.fn(),
          },
        ],
      }),
    );

    render(<a ref={result.current.setRowAnchorRef} />);

    // Act
    result.current.setAnchorPosition({
      kind: "cell",
      location: [2, 0], // note: 2 is the index of the "price" column (with 'action')
      bounds: { x: 0, y: 0, width: 0, height: 0 },
      isEdge: false,
      shiftKey: false,
      ctrlKey: false,
      isFillHandle: false,
      metaKey: false,
      isTouch: false,
      localEventX: 81,
      localEventY: 39,
      button: 0,
      scrollEdge: [0, 0],
    } as GridMouseEventArgs);

    // Assert
    expect(result.current.rowAnchorRef.current!.href).toBe("");
  });
  it("should hide the anchor when the pointer is not over a linkable cell", () => {
    // Arrange - the anchor may only stay visible while it covers the cell under the pointer,
    // otherwise it would swallow pointer events for a row the cursor has already left.
    const { result } = renderHook(() => useRowAnchor(props));

    render(<a ref={result.current.setRowAnchorRef} />);

    const hover = (args: Partial<GridMouseEventArgs>) =>
      result.current.setAnchorPosition({
        kind: "cell",
        location: [1, 0],
        bounds: { x: 10, y: 20, width: 100, height: 32 },
        isEdge: false,
        shiftKey: false,
        ctrlKey: false,
        isFillHandle: false,
        metaKey: false,
        isTouch: false,
        localEventX: 81,
        localEventY: 39,
        button: 0,
        scrollEdge: [0, 0],
        ...args,
      } as GridMouseEventArgs);

    // Act & Assert - leaving the grid entirely
    hover({});
    expect(result.current.rowAnchorRef.current!.style.display).toBe("block");

    hover({ kind: "out-of-bounds" });
    expect(result.current.rowAnchorRef.current!.style.display).toBe("none");

    // Act & Assert - moving onto the header
    hover({});
    expect(result.current.rowAnchorRef.current!.style.display).toBe("block");

    hover({ kind: "header" });
    expect(result.current.rowAnchorRef.current!.style.display).toBe("none");

    // Act & Assert - moving onto the row selection checkbox, which Glide reports as column -1
    hover({});
    expect(result.current.rowAnchorRef.current!.style.display).toBe("block");

    hover({ location: [-1, 0] });
    expect(result.current.rowAnchorRef.current!.style.display).toBe("none");
  });
});
