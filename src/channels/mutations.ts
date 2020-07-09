import { channelErrorFragment } from "@saleor/fragments/channels";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { ChannelCreate, ChannelCreateVariables } from "./types/ChannelCreate";

export const channelCreateMutation = gql`
  ${channelErrorFragment}
  mutation ChannelCreate($input: ChannelCreateInput!) {
    channelCreate(input: $input) {
      channel {
        id
        name
        slug
        currencyCode
      }
      errors: channelErrors {
        ...ChannelErrorFragment
      }
    }
  }
`;

export const useChannelCreateMutation = makeMutation<
  ChannelCreate,
  ChannelCreateVariables
>(channelCreateMutation);
