import { pluginErrorFragment } from "@saleor/fragments/errors";
import { pluginsDetailsFragment } from "@saleor/fragments/plugins";
import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { PluginUpdate, PluginUpdateVariables } from "./types/PluginUpdate";

const pluginUpdate = gql`
  ${pluginsDetailsFragment}
  ${pluginErrorFragment}
  mutation PluginUpdate($channelId: ID, $id: ID!, $input: PluginUpdateInput!) {
    pluginUpdate(channelId: $channelId, id: $id, input: $input) {
      errors {
        ...PluginErrorFragment
      }
      plugin {
        ...PluginsDetailsFragment
      }
    }
  }
`;
export const TypedPluginUpdate = TypedMutation<
  PluginUpdate,
  PluginUpdateVariables
>(pluginUpdate);
