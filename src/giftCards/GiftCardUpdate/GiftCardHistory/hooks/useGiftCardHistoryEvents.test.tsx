import { renderHook } from "@testing-library/react-hooks";
import React from "react";

import { giftCardsMocks } from "../../../../../testUtils/mocks/giftCards";
import { useUser } from "../../../../auth";
import { useGiftCardEventsQuery } from "../../../../graphql";
import { GiftCardDetailsContext } from "../../providers/GiftCardDetailsProvider";
import useGiftCardHistoryEvents from "./useGiftCardHistoryEvents";

// Mock the dependencies
jest.mock("@dashboard/auth");
jest.mock("@dashboard/graphql");

const mockUseUser = useUser as jest.Mock;
const mockUseGiftCardEventsQuery = useGiftCardEventsQuery as jest.Mock;

const mockGiftCard = {
  ...giftCardsMocks[0],
  id: "giftCardId",
};
const mockUser = {
  userPermissions: [{ code: "MANAGE_USERS" }, { code: "MANAGE_APPS" }],
};

mockUseUser.mockReturnValue({ user: mockUser });
mockUseGiftCardEventsQuery.mockImplementation(value => {
  if (value.skip) {
    return {
      data: undefined,
    };
  }

  if (!value.variables.canSeeApp || !value.variables.canSeeUser) {
    return {
      data: undefined,
    };
  }

  return {
    data: {
      giftCard: {
        events: [{ id: "event1" }, { id: "event2" }],
      },
    },
  };
});

describe("useGiftCardEventsQuery (mock implementation)", () => {
  it("should return gift card events", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useGiftCardEventsQuery({
        variables: { id: "giftCardId", canSeeApp: true, canSeeUser: true },
        skip: false,
      }),
    );

    // Assert
    expect(result.current.data).toEqual({
      giftCard: { events: [{ id: "event1" }, { id: "event2" }] },
    });
  });

  it("should return undefined without permissions", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useGiftCardEventsQuery({
        variables: { id: "giftCardId", canSeeApp: false, canSeeUser: false },
        skip: false,
      }),
    );

    // Assert
    expect(result.current.data).toBeUndefined();
  });

  it("should return undefined when it is skipped", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useGiftCardEventsQuery({
        variables: { id: "giftCardId", canSeeApp: true, canSeeUser: true },
        skip: true,
      }),
    );

    // Assert
    expect(result.current.data).toBeUndefined();
  });
});

describe("useGiftCardHistoryEvents", () => {
  it("should return gift card events", () => {
    // Arrange
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GiftCardDetailsContext.Provider value={{ giftCard: mockGiftCard, loading: false }}>
        {children}
      </GiftCardDetailsContext.Provider>
    );

    // Act
    const { result } = renderHook(() => useGiftCardHistoryEvents(), { wrapper });

    // Assert
    expect(result.current.id).toBe("giftCardId");
    expect(result.current.events).toEqual([{ id: "event1" }, { id: "event2" }]);
  });

  it("should return undefined when there is no gift card", () => {
    // Arrange
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GiftCardDetailsContext.Provider value={{ giftCard: undefined, loading: false }}>
        {children}
      </GiftCardDetailsContext.Provider>
    );

    // Act
    const { result } = renderHook(() => useGiftCardHistoryEvents(), { wrapper });

    //
    expect(result.current.id).toBeUndefined();
    expect(result.current.events).toBeUndefined();
  });

  it("should return undefined when user does not have permissions", () => {
    // Arrange
    mockUseUser.mockReturnValue({ user: { userPermissions: [] } });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GiftCardDetailsContext.Provider value={{ giftCard: mockGiftCard, loading: false }}>
        {children}
      </GiftCardDetailsContext.Provider>
    );

    // Act
    const { result } = renderHook(() => useGiftCardHistoryEvents(), { wrapper });

    // Assert
    expect(result.current.id).toBe("giftCardId");
    expect(result.current.events).toBeUndefined();
  });
});
