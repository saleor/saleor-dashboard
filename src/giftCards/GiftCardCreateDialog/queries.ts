import { gql } from "@apollo/client";

export const channelCurrencies = gql`
  query ChannelCurrencies {
    shop {
      channelCurrencies
    }
  }
`;
