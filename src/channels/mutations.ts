import { gql } from "@apollo/client";

export const channelCreateMutation = gql`
  mutation ChannelCreate($input: ChannelCreateInput!) {
    channelCreate(input: $input) {
      channel {
        ...ChannelDetailsFragment
      }
      errors {
        ...ChannelErrorFragment
      }
    }
  }
`;

export const channelUpdateMutation = gql`
  mutation ChannelUpdate($id: ID!, $input: ChannelUpdateInput!) {
    channelUpdate(id: $id, input: $input) {
      channel {
        ...ChannelDetailsFragment
      }
      errors {
        ...ChannelErrorFragment
      }
    }
  }
`;

export const channelDeleteMutation = gql`
  mutation ChannelDelete($id: ID!, $input: ChannelDeleteInput) {
    channelDelete(id: $id, input: $input) {
      errors {
        ...ChannelErrorFragment
      }
    }
  }
`;

export const channelActivateMutation = gql`
  mutation ChannelActivate($id: ID!) {
    channelActivate(id: $id) {
      channel {
        ...ChannelDetailsFragment
      }
      errors {
        ...ChannelErrorFragment
      }
    }
  }
`;

export const channelDeactivateMutation = gql`
  mutation ChannelDeactivate($id: ID!) {
    channelDeactivate(id: $id) {
      channel {
        ...ChannelDetailsFragment
      }
      errors {
        ...ChannelErrorFragment
      }
    }
  }
`;
