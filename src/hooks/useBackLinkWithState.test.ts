import { renderHook } from "@testing-library/react-hooks";
import { useLocation } from "react-router";

import { useBackLinkWithState } from "./useBackLinkWithState";

jest.mock("react-router", () => ({
  useLocation: jest.fn(),
}));

describe("useBackLinkWithState", () => {
  // Arrange
  it("should return path if there is no previous location in state", () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: {},
    });

    // Act
    const { result } = renderHook(() =>
      useBackLinkWithState({
        path: "/orders",
      }),
    );

    // Assert
    expect(result.current).toBe("/orders");
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
    const { result } = renderHook(() =>
      useBackLinkWithState({
        path: "/orders",
      }),
    );

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
    const { result } = renderHook(() =>
      useBackLinkWithState({
        path: "/orders/drafts",
      }),
    );

    // Assert
    expect(result.current).toBe("/orders/drafts?asc=false&after=cursor");
  });
});
