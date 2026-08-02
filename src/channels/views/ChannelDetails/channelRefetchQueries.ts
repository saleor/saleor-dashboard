import { ChannelDocument, ChannelShippingZonesDocument } from "@dashboard/graphql";

/** Keep channel details + assigned shipping zones in sync after mutations. */
export const getChannelDetailsRefetchQueries = (channelId: string) => [
  { query: ChannelDocument, variables: { id: channelId } },
  {
    query: ChannelShippingZonesDocument,
    variables: { filter: { channels: [channelId] } },
  },
];
