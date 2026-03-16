import { gql } from "@apollo/client";

export const channelCreateMutation = gql`
  mutation ChannelCreate($input: ChannelCreateInput!) {
    channelCreate(input: $input) {
      channel {
        ...ChannelDetails
      }
      errors {
        ...ChannelError
      }
    }
  }
`;

export const channelUpdateMutation = gql`
  mutation ChannelUpdate($id: ID!, $input: ChannelUpdateInput!) {
    channelUpdate(id: $id, input: $input) {
      channel {
        ...ChannelDetails
      }
      errors {
        ...ChannelError
      }
    }
  }
`;
