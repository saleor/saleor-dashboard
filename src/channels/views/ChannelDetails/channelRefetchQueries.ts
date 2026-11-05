import { ChannelDocument, ChannelShippingZonesDocument } from "@dashboard/graphql";

/**
 * Keep channel details + assigned shipping zones in sync after mutations.
 * Shipping zones need MANAGE_SHIPPING; `refetchQueries` runs them even when skipped.
 */
export const getChannelDetailsRefetchQueries = (
  channelId: string,
  { includeShippingZones }: { includeShippingZones: boolean },
) => [
  { query: ChannelDocument, variables: { id: channelId } },
  ...(includeShippingZones
    ? [
        {
          query: ChannelShippingZonesDocument,
          variables: { filter: { channels: [channelId] } },
        },
      ]
    : []),
];
