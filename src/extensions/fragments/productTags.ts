import { productFragment } from "@saleor/fragments/products";
import gql from "graphql-tag";

export const tagFragment = gql`
  fragment TagFragment on Tag {
    id
    name
    slug
    created
    modified
  }
`;

export const productTagFragment = gql`
  ${productFragment}
  ${tagFragment}
  fragment ProductTagFragment on ProductTag {
    id
    tag {
      ...TagFragment
    }
    product {
      ...ProductFragment
    }
    created
    modified
  }
`;
