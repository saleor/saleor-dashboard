import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { Channels } from "./types/Channels";

export const channelsList = gql`
  query Channels {
    channels {
      id
      name
      slug
      currencyCode
    }
  }
`;

export const useChannelsList = makeQuery<Channels, {}>(channelsList);
