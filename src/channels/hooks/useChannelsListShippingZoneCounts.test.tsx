import { useChannelsListShippingCoverageQuery } from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";

import { useChannelsListShippingZoneCounts } from "./useChannelsListShippingZoneCounts";

jest.mock("@dashboard/graphql", () => ({
  useChannelsListShippingCoverageQuery: jest.fn(),
}));

const mockedUseQuery = useChannelsListShippingCoverageQuery as jest.Mock;

const page = ({ channelIds, hasNextPage }: { channelIds: string[]; hasNextPage: boolean }) => ({
  shippingZones: {
    pageInfo: { hasNextPage, endCursor: hasNextPage ? "cursor" : null },
    edges: [
      {
        node: {
          id: "zone",
          channels: channelIds.map(id => ({ id })),
        },
      },
    ],
  },
});

describe("useChannelsListShippingZoneCounts", () => {
  beforeEach(() => {
    mockedUseQuery.mockReset();
  });

  it("exposes counts when the first page is complete", () => {
    // Arrange
    mockedUseQuery.mockReturnValue({
      data: page({ channelIds: ["ch-1", "ch-2"], hasNextPage: false }),
      loading: false,
    });

    // Act
    const { result } = renderHook(() => useChannelsListShippingZoneCounts());

    // Assert
    expect(result.current.shippingCoverageLoading).toBe(false);
    expect(result.current.shippingZoneCountsByChannelId?.get("ch-1")).toBe(1);
    expect(result.current.shippingZoneCountsByChannelId?.get("ch-2")).toBe(1);
  });

  it("treats incomplete coverage as unknown instead of paginating", () => {
    // Arrange
    mockedUseQuery.mockReturnValue({
      data: page({ channelIds: ["ch-1"], hasNextPage: true }),
      loading: false,
    });

    // Act
    const { result } = renderHook(() => useChannelsListShippingZoneCounts());

    // Assert
    expect(result.current.shippingZoneCountsByChannelId).toBeUndefined();
    expect(result.current.shippingCoverageLoading).toBe(false);
  });

  it("skips the query when requested", () => {
    // Arrange
    mockedUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
    });

    // Act
    const { result } = renderHook(() => useChannelsListShippingZoneCounts({ skip: true }));

    // Assert
    expect(mockedUseQuery).toHaveBeenCalledWith({ skip: true });
    expect(result.current.shippingZoneCountsByChannelId).toBeUndefined();
    expect(result.current.shippingCoverageLoading).toBe(false);
  });
});
