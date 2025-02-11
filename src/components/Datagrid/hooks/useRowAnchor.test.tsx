import { GridMouseEventArgs } from "@glideapps/glide-data-grid";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";

import { useRowAnchor } from "./useRowAnchor";

jest.mock("@dashboard/hooks/useDebounce", () => jest.fn(fn => fn));

describe("useRowAnchor", () => {
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
});
