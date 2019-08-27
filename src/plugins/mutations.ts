import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { pluginsDetailsFragment } from "./queries";
import {
  PluginConfigurationUpdate,
  PluginConfigurationUpdateVariables
} from "./types/pluginConfigurationUpdate";

const pluginConfigurationUpdate = gql`
  ${pluginsDetailsFragment}
  mutation PluginConfigurationUpdate(
    $id: ID!
    $input: PluginConfigurationUpdateInput!
  ) {
    pluginConfigurationUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      pluginConfiguration {
        ...pluginsDetailsFragment
      }
    }
  }
`;
export const TypedPluginConfigurationUpdate = TypedMutation<
  PluginConfigurationUpdate,
  PluginConfigurationUpdateVariables
>(pluginConfigurationUpdate);
