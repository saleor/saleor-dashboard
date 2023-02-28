import { gql } from "@apollo/client";

export const channelOrderSettingsUpdateMutation = gql`
  mutation ChannelOrderSettingsUpdate($id: ID!, $input: ChannelUpdateInput!) {
    channelUpdate(id: $id, input: $input) {
      channel {
        ...ChannelDetails
        ...ChannelOrderSettings
      }
      errors {
        ...ChannelError
      }
    }
  }
`;

export const channelCreateWithSettingsMutation = gql`
  mutation ChannelCreateWithSettings($input: ChannelCreateInput!) {
    channelCreate(input: $input) {
      channel {
        ...ChannelDetails
        ...ChannelOrderSettings
      }
      errors {
        ...ChannelError
      }
    }
  }
`;
