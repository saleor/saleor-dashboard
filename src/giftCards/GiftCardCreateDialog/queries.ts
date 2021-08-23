import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { ChannelCurrencies } from "./types/ChannelCurrencies";

const channelCurrencies = gql`
  query ChannelCurrencies {
    shop {
      channelCurrencies
    }
  }
`;
export const useChannelCurrencies = makeQuery<ChannelCurrencies, {}>(
  channelCurrencies
);
