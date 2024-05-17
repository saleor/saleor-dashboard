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

export const categoryWithAncestorFragment = gql`
  fragment CategoryWithAncestors on Category {
    id
    name
    parent {
      id
      name
    }
    level
    ancestors(first: 1) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
