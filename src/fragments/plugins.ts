import gql from "graphql-tag";

export const pluginsFragment = gql`
  fragment PluginFragment on Plugin {
    id
    name
    description
    active
  }
`;

export const pluginsDetailsFragment = gql`
  ${pluginsFragment}
  fragment PluginsDetailsFragment on Plugin {
    ...PluginFragment
    configuration {
      name
      type
      value
      helpText
      label
    }
  }
`;
