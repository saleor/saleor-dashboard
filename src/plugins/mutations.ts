import { gql } from "@apollo/client";

export const pluginUpdate = gql`
  mutation PluginUpdate($channelId: ID, $id: ID!, $input: PluginUpdateInput!) {
    pluginUpdate(channelId: $channelId, id: $id, input: $input) {
      errors {
        ...PluginError
      }
      plugin {
        ...PluginsDetails
      }
    }
  }
`;
