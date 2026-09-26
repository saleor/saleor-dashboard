import { gql } from "@apollo/client";

/** Details for products already assigned to a reference attribute. */
export const productReferenceListDetailsQuery = gql`
  query ProductReferenceListDetails($ids: [ID!]!, $first: Int!) {
    products(first: $first, where: { ids: $ids }) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          category {
            id
            name
          }
          productType {
            id
            name
          }
        }
      }
    }
  }
`;

/** Details for variants already assigned to a reference attribute. */
export const variantReferenceListDetailsQuery = gql`
  query VariantReferenceListDetails($ids: [ID!]!, $first: Int!) {
    productVariants(first: $first, where: { ids: $ids }) {
      edges {
        node {
          id
          name
          product {
            name
            thumbnail {
              url
            }
          }
        }
      }
    }
  }
`;
