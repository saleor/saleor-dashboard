import { GridMouseEventArgs } from "@glideapps/glide-data-grid";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";

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
    const { result } = renderHook(() => useRowAnchor(props));

    render(<a ref={result.current.setRowAnchorRef} />);

    expect(result.current.rowAnchorRef).toBeDefined();
  });
  it("should have anchor set", () => {
    const { result } = renderHook(() => useRowAnchor(props));

    render(<a ref={result.current.setRowAnchorRef} />);

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

    expect(result.current.rowAnchorRef.current!).not.toBeNull();
    expect(result.current.rowAnchorRef.current!.style.left).toBe("0px");
    expect(result.current.rowAnchorRef.current!.href).toBe("http://localhost/test");
  });
  it("should not set anchor position when cell has action", () => {
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

    result.current.setAnchorPosition({
      kind: "cell",
      location: [2, 0],
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

    expect(result.current.rowAnchorRef.current!.href).toBe("");
  });
});
