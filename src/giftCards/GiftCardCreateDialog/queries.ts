import { gql } from "@apollo/client";
import makeQuery from "@saleor/hooks/makeQuery";

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
