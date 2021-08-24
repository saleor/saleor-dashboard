import gql from "graphql-tag";
import makeQuery from "@saleor/hooks/makeQuery";
import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import { ProductTagList, ProductTagListVariables } from "./types/ProductTagList";
import { productTagFragment } from "../fragments/productTags";

const productTagList = gql`
  ${productTagFragment}
  ${pageInfoFragment}
  query ProductTagList(
    $before: String
    $after: String
    $first: Int
    $last: Int
    $product: ID
  ) {
    productTags(
      before: $before
      after: $after
      first: $first
      last: $last
      product: $product
    ) {
      edges {
        node {
          ...ProductTagFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const useProductTagListQuery = makeQuery<
  ProductTagList,
  ProductTagListVariables
>(productTagList);

