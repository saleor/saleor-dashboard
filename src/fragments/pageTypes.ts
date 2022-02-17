import { gql } from "@apollo/client";

export const pageTypeFragment = gql`
  fragment PageType on PageType {
    id
    name
    hasPages
  }
`;

export const pageTypeDetailsFragment = gql`
  fragment PageTypeDetails on PageType {
    ...PageType
    ...Metadata
    attributes {
      ...Attribute
    }
  }
`;
