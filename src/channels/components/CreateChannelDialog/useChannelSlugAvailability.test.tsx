import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { ChannelBySlugDocument, PermissionEnum } from "@dashboard/graphql";
import { act, renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";

import {
  CHANNEL_SLUG_CHECK_DEBOUNCE_MS,
  useChannelSlugAvailability,
} from "./useChannelSlugAvailability";

const permissionVariables = Object.keys(PermissionEnum).reduce<Record<string, boolean>>(
  (acc, code) => ({ ...acc, [`PERMISSION_${code}`]: false }),
  {},
);

const createChannelBySlugMock = (slug: string, exists: boolean): MockedResponse => ({
  request: {
    query: ChannelBySlugDocument,
    variables: {
      slug,
      ...permissionVariables,
    },
  },
  result: {
    data: {
      channel: exists
        ? {
            __typename: "Channel",
            id: "channel-1",
            slug,
          }
        : null,
    },
  },
});

const createWrapper = (mocks: MockedResponse[]) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MockedProvider mocks={mocks} addTypename>
      {children}
    </MockedProvider>
  );

  Wrapper.displayName = "ChannelSlugAvailabilityWrapper";

  return Wrapper;
};

describe("useChannelSlugAvailability", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("reports taken after debounce when a channel with the slug exists", async () => {
    // Arrange
    const { result } = renderHook(() => useChannelSlugAvailability("default-channel"), {
      wrapper: createWrapper([createChannelBySlugMock("default-channel", true)]),
    });

    expect(result.current.isChecking).toBe(true);
    expect(result.current.isTaken).toBe(false);

    // Act
    act(() => {
      jest.advanceTimersByTime(CHANNEL_SLUG_CHECK_DEBOUNCE_MS);
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
      expect(result.current.isTaken).toBe(true);
    });
  });

  it("reports available after debounce when no channel matches the slug", async () => {
    // Arrange
    const { result } = renderHook(() => useChannelSlugAvailability("brand-new"), {
      wrapper: createWrapper([createChannelBySlugMock("brand-new", false)]),
    });

    // Act
    act(() => {
      jest.advanceTimersByTime(CHANNEL_SLUG_CHECK_DEBOUNCE_MS);
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
      expect(result.current.isTaken).toBe(false);
    });
  });

  it("does not query an empty slug", () => {
    // Arrange / Act
    const { result } = renderHook(() => useChannelSlugAvailability("   "), {
      wrapper: createWrapper([]),
    });

    act(() => {
      jest.advanceTimersByTime(CHANNEL_SLUG_CHECK_DEBOUNCE_MS);
    });

    // Assert
    expect(result.current.isChecking).toBe(false);
    expect(result.current.isTaken).toBe(false);
  });
});
