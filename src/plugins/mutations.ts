import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { pluginsDetailsFragment } from "./queries";
import { PluginUpdate, PluginUpdateVariables } from "./types/PluginUpdate";

const pluginUpdate = gql`
  ${pluginsDetailsFragment}
  mutation PluginUpdate($id: ID!, $input: PluginUpdateInput!) {
    pluginUpdate(id: $id, input: $input) {
      errors {
        field
        message
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
