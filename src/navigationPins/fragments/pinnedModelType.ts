import { gql } from "@apollo/client";

/**
 * Selected per alias by the runtime-built document in `buildPinnedModelTypesDocument`.
 * Kept here so codegen picks it up and the alias map can be typed against a real fragment.
 */
export const pinnedModelTypeFragment = gql`
  # Spread by the runtime-built document in buildPinnedModelTypesDocument, which static analysis cannot see.
  # eslint-disable-next-line @graphql-eslint/no-unused-fragments
  fragment PinnedModelType on PageType {
    id
    name
  }
`;
