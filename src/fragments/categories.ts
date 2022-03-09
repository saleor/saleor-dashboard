import { gql } from "@apollo/client";

export const categoryFragment = gql`
  fragment Category on Category {
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
  fragment CategoryDetails on Category {
    id
    ...Metadata
    backgroundImage {
      alt
      url
    }
    name
    slug
    description
    seoDescription
    seoTitle
    parent {
      id
    }
  }
`;
