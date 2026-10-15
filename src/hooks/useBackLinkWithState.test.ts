import { renderHook } from "@testing-library/react";
import { useLocation } from "react-router";

import { getPrevLocationState, useBackLinkWithState } from "./useBackLinkWithState";

jest.mock("react-router", () => ({
  useLocation: jest.fn(),
}));

describe("useBackLinkWithState", () => {
  it("captures the current order list page and filters", () => {
    // Arrange
    const location = { pathname: "/orders", search: "?after=cursor&query=Alice" };

    // Act
    const state = getPrevLocationState(location);

    // Assert
    expect(state).toEqual({ prevLocation: location });
  });

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
          search: "?asc=false&after=cursor&query=Alice",
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
    expect(result.current).toBe("/orders?asc=false&after=cursor&query=Alice");
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

  it("should omit /dashboard from pathname when returning the previous URL", () => {
    // Arrange
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        prevLocation: {
          pathname: "/dashboard/collections/Q29sbGVjdGlvbjoxNjY",
          search: "",
        },
      },
    });

    // Act
    const { result } = renderHook(() =>
      useBackLinkWithState({
        path: "/collections",
      }),
    );

    // Assert
    expect(result.current).toBe("/collections/Q29sbGVjdGlvbjoxNjY");
  });
});
