import { pluginErrorFragment } from "@saleor/fragments/errors";
import { pluginsDetailsFragment } from "@saleor/fragments/plugins";
import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { PluginUpdate, PluginUpdateVariables } from "./types/PluginUpdate";

const pluginUpdate = gql`
  ${pluginsDetailsFragment}
  ${pluginErrorFragment}
  mutation PluginUpdate($id: ID!, $input: PluginUpdateInput!) {
    pluginUpdate(id: $id, input: $input) {
      errors: pluginsErrors {
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
