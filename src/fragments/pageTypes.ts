import gql from "graphql-tag";

import { attributeFragment } from "./attributes";
import { metadataFragment } from "./metadata";

export const pageTypeFragment = gql`
  fragment PageTypeFragment on PageType {
    id
    name
  }
`;

export const pageTypeDetailsFragment = gql`
  ${attributeFragment}
  ${pageTypeFragment}
  ${metadataFragment}
  fragment PageTypeDetailsFragment on PageType {
    ...PageTypeFragment
    ...MetadataFragment
    attributes {
      ...AttributeFragment
    }
  }
`;
