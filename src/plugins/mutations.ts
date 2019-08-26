import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { pluginsDetailsFragment } from "./queries";
import {
  pluginConfigurationUpdate,
  pluginConfigurationUpdateVariables
} from "./types/pluginConfigurationUpdate";

const pluginConfigurationUpdate = gql`
  ${pluginsDetailsFragment}
  mutation pluginConfigurationUpdate(
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
  pluginConfigurationUpdate,
  pluginConfigurationUpdateVariables
>(pluginConfigurationUpdate);
