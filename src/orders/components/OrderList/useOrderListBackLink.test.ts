import { renderHook } from "@testing-library/react-hooks";
import { useLocation } from "react-router";

import { useOrderListBackLink } from "./useOrderListBackLink";

jest.mock("react-router", () => ({
  useLocation: jest.fn(),
}));

describe("useOrderListBackLink", () => {
  // Arrange
  it("should return null if there is no previous location in state", () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: {},
    });

    // Act
    const { result } = renderHook(() => useOrderListBackLink());

    // Assert
    expect(result.current).toBeNull();
  });

  it("should return null if the previous location is not an order list path", () => {
    // Arrange
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        prevLocation: {
          pathname: "/configuration",
          search: "?query=param",
        },
      },
    });

    // Act
    const { result } = renderHook(() => useOrderListBackLink());

    // Assert
    expect(result.current).toBeNull();
  });

  it("should return the previous URL if it is an order list path", () => {
    // Arrange

    (useLocation as jest.Mock).mockReturnValue({
      state: {
        prevLocation: {
          pathname: "/orders",
          search: "?asc=false&after=cursor",
        },
      },
    });

    // Act
    const { result } = renderHook(() => useOrderListBackLink());

    // Assert
    expect(result.current).toBe("/orders?asc=false&after=cursor");
  });

  it("should return the previous URL if it is a draft order list path", () => {
    // Arrange
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        prevLocation: {
          pathname: "/orders/drafts",
          search: "?asc=false&after=cursor",
        },
      },
    });

    // Act
    const { result } = renderHook(() => useOrderListBackLink());

    // Assert
    expect(result.current).toBe("/orders/drafts?asc=false&after=cursor");
  });
});
