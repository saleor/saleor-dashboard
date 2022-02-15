import { gql } from "@apollo/client";

import { attributeFragment } from "./attributes";
import { metadataFragment } from "./metadata";

export const pageTypeFragment = gql`
  fragment PageTypeFragment on PageType {
    id
    name
    hasPages
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
