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

describe("useGiftCardHistoryEvents", () => {
  it("should return gift card events", () => {
    // Arrange
    mockUseGiftCardEventsQuery.mockImplementation(() => ({
      data: {
        giftCard: {
          events: [
            { id: "event1", app: {}, user: {} },
            { id: "event2", app: {}, user: {} },
          ],
        },
      },
    }));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GiftCardDetailsContext.Provider value={{ giftCard: mockGiftCard, loading: false }}>
        {children}
      </GiftCardDetailsContext.Provider>
    );

    // Act
    const { result } = renderHook(() => useGiftCardHistoryEvents(), { wrapper });

    // Assert
    expect(result.current.id).toBe("giftCardId");
    expect(result.current.events).toEqual([
      { id: "event1", app: {}, user: {} },
      { id: "event2", app: {}, user: {} },
    ]);
    expect(mockUseGiftCardEventsQuery).toBeCalledWith({
      variables: { id: "giftCardId", canSeeApp: true, canSeeUser: true },
      skip: false,
    });
  });

  it("should return undefined when there is no gift card", () => {
    // Arrange
    mockUseGiftCardEventsQuery.mockImplementation(() => ({
      data: undefined,
    }));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GiftCardDetailsContext.Provider value={{ giftCard: undefined, loading: false }}>
        {children}
      </GiftCardDetailsContext.Provider>
    );

    // Act
    const { result } = renderHook(() => useGiftCardHistoryEvents(), { wrapper });

    // Assert
    expect(result.current.id).toBeUndefined();
    expect(result.current.events).toBeUndefined();
    expect(mockUseGiftCardEventsQuery).toBeCalledWith({
      variables: undefined,
      skip: true,
    });
  });

  it("should not return app and user when user does not have permissions", () => {
    // Arrange
    mockUseUser.mockReturnValue({ user: { userPermissions: [] } });
    mockUseGiftCardEventsQuery.mockImplementation(() => ({
      data: {
        giftCard: {
          events: [{ id: "event1" }, { id: "event2" }],
        },
      },
    }));

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
    expect(mockUseGiftCardEventsQuery).toBeCalledWith({
      variables: { id: "giftCardId", canSeeApp: false, canSeeUser: false },
      skip: false,
    });
  });
});
