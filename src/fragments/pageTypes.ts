import gql from "graphql-tag";

import { metadataFragment } from "./metadata";

export const pageTypeFragment = gql`
  fragment PageTypeFragment on PageType {
    id
    name
  }
`;

export const pageTypeDetailsFragment = gql`
  ${pageTypeFragment}
  ${metadataFragment}
  fragment PageTypeDetailsFragment on PageType {
    ...PageTypeFragment
    ...MetadataFragment
  }
`;
