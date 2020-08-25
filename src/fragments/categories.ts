import gql from "graphql-tag";

import { metadataFragment } from "./metadata";

export const categoryFragment = gql`
  fragment CategoryFragment on Category {
    id
    name
    children {
      totalCount
    }
    products {
      totalCount
    }
  }
`;
export const categoryDetailsFragment = gql`
  ${metadataFragment}
  fragment CategoryDetailsFragment on Category {
    id
    ...Metadata
    backgroundImage {
      alt
      url
    }
    name
    descriptionJson
    seoDescription
    seoTitle
    parent {
      id
    }
  }
`;
