import gql from "graphql-tag";
import makeMutation from "@saleor/hooks/makeMutation";
import { productErrorFragment } from "@saleor/fragments/errors";
import { productTagFragment } from "../fragments/productTags";
import { ProductTagCreate, ProductTagCreateVariables } from "./types/ProductTagCreate";
import { ProductTagDelete, ProductTagDeleteVariables } from "./types/ProductTagDelete";

const productTagCreate = gql`
  ${productErrorFragment}
  ${productTagFragment}
  mutation ProductTagCreate($product: ID!, $name: String!) {
    productTagCreate (input: {name: $name, product: $product}) {
      errors: productTagErrors {
        ...ProductErrorFragment
      }
      productTag {
        ...ProductTagFragment
      }
    }
  }
`;

export const useProductTagCreateMutation = makeMutation<
  ProductTagCreate,
  ProductTagCreateVariables
>(productTagCreate);

const productTagDelete = gql`
  ${productErrorFragment}
  ${productTagFragment}
  mutation ProductTagDelete($id: ID!) {
    productTagDelete (id: $id) {
      errors: productTagErrors {
        ...ProductErrorFragment
      }
      productTag {
        ...ProductTagFragment
      }
    }
  }
`;

export const useProductTagDeleteMutation = makeMutation<
  ProductTagDelete,
  ProductTagDeleteVariables
>(productTagDelete);
