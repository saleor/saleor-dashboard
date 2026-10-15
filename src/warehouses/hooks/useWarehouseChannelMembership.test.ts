import type * as ApolloClientModule from "@apollo/client";
import type * as GraphqlTypes from "@dashboard/graphql/types.generated";
import { act, renderHook, type RenderHookResult } from "@testing-library/react";

import { useWarehouseChannelMembership } from "./useWarehouseChannelMembership";

const mockQuery = jest.fn();
// Stable like the real client: a new object per render would re-run the probe effect forever.
const mockClient = { query: mockQuery };

jest.mock("@apollo/client", () => ({
  ...jest.requireActual<typeof ApolloClientModule>("@apollo/client"),
  useApolloClient: (): { query: jest.Mock } => mockClient,
}));
jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<typeof GraphqlTypes>("@dashboard/graphql/types.generated"),
  // A null warehouse count picks the probe plan, which asks about one warehouse at a time.
  useWarehouseChannelMembershipCountsQuery: (): object => ({
    data: { channels: [{ id: "ch-eu", name: "Europe" }], warehouses: null },
    loading: false,
    refetch: jest.fn(),
  }),
  useWarehouseChannelMembershipMatrixQuery: (): object => ({ data: undefined, refetch: jest.fn() }),
}));
jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: jest.fn() }),
}));

type Membership = ReturnType<typeof useWarehouseChannelMembership>;
type MembershipProps = { warehouseId: string };
type RenderedChannels = { warehouseId: string; channelIds: string[] };

/** Records every render, because a stale value can show for one render before an effect fixes it. */
const renderMembership = (
  rendered: RenderedChannels[],
): RenderHookResult<Membership, MembershipProps> =>
  renderHook<Membership, MembershipProps>(
    ({ warehouseId }) => {
      const membership = useWarehouseChannelMembership(warehouseId);

      rendered.push({ warehouseId, channelIds: membership.channels.map(channel => channel.id) });

      return membership;
    },
    { initialProps: { warehouseId: "w-a" } },
  );

describe("useWarehouseChannelMembership", () => {
  it("never shows the previous warehouse's channels after navigating", async () => {
    // Arrange
    const rendered: RenderedChannels[] = [];

    mockQuery.mockResolvedValueOnce({ data: { c0: { totalCount: 1 } } });
    mockQuery.mockReturnValueOnce(new Promise(() => undefined));

    const { rerender } = renderMembership(rendered);

    await act(async () => undefined);

    // Act
    rerender({ warehouseId: "w-b" });

    // Assert
    expect(rendered).toContainEqual({ warehouseId: "w-a", channelIds: ["ch-eu"] });
    expect(rendered.filter(render => render.warehouseId === "w-b")).not.toContainEqual({
      warehouseId: "w-b",
      channelIds: ["ch-eu"],
    });
  });
});
