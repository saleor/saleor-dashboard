import {
  channelDetailsFragment,
  channelErrorFragment
} from "@saleor/fragments/channels";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { channelDetailsFragment } from "./queries";
import { ChannelCreate, ChannelCreateVariables } from "./types/ChannelCreate";
import { ChannelUpdate, ChannelUpdateVariables } from "./types/ChannelUpdate";

export const channelCreateMutation = gql`
  ${channelErrorFragment}
  ${channelDetailsFragment}
  mutation ChannelCreate($input: ChannelCreateInput!) {
    channelCreate(input: $input) {
      channel {
        ...ChannelDetailsFragment
      }
      errors: channelErrors {
        ...ChannelErrorFragment
      }
    }
  }
`;

export const channelUpdateMutation = gql`
  ${channelErrorFragment}
  ${channelDetailsFragment}
  mutation ChannelUpdate($id: ID!, $input: ChannelUpdateInput!) {
    channelUpdate(id: $id, input: $input) {
      channel {
        ...ChannelDetailsFragment
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

export const useChannelUpdateMutation = makeMutation<
  ChannelUpdate,
  ChannelUpdateVariables
>(channelUpdateMutation);
