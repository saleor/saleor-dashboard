import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import {
  fragmentMoney,
  fragmentVariant,
  productFragment,
  productFragmentDetails,
  productVariantAttributesFragment
} from "@saleor/fragments/products";
import { taxTypeFragment } from "@saleor/fragments/taxes";
import { warehouseFragment } from "@saleor/fragments/warehouses";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { CountAllProducts } from "./types/CountAllProducts";
import {
  CreateMultipleVariantsData,
  CreateMultipleVariantsDataVariables
} from "./types/CreateMultipleVariantsData";
import {
  GridAttributes,
  GridAttributesVariables
} from "./types/GridAttributes";
import {
  InitialProductFilterData,
  InitialProductFilterDataVariables
} from "./types/InitialProductFilterData";
import {
  ProductDetails,
  ProductDetailsVariables
} from "./types/ProductDetails";
import {
  ProductImageById,
  ProductImageByIdVariables
} from "./types/ProductImageById";
import { ProductList, ProductListVariables } from "./types/ProductList";
import {
  ProductVariantCreateData,
  ProductVariantCreateDataVariables
} from "./types/ProductVariantCreateData";
import {
  ProductVariantDetails,
  ProductVariantDetailsVariables
} from "./types/ProductVariantDetails";

const initialProductFilterDataQuery = gql`
  query InitialProductFilterData(
    $categories: [ID!]
    $collections: [ID!]
    $productTypes: [ID!]
  ) {
    attributes(first: 100, filter: { filterableInDashboard: true }) {
      edges {
        node {
          id
          name
          slug
          values {
            id
            name
            slug
          }
        }
      }
    }
    categories(first: 100, filter: { ids: $categories }) {
      edges {
        node {
          id
          name
        }
      }
    }
    collections(first: 100, filter: { ids: $collections }) {
      edges {
        node {
          id
          name
        }
      }
    }
    productTypes(first: 100, filter: { ids: $productTypes }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
export const useInitialProductFilterDataQuery = makeQuery<
  InitialProductFilterData,
  InitialProductFilterDataVariables
>(initialProductFilterDataQuery);

const productListQuery = gql`
  ${fragmentMoney}
  ${productFragment}
  query ProductList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: ProductFilterInput
    $sort: ProductOrder
  ) {
    products(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...ProductFragment
          attributes {
            attribute {
              id
            }
            values {
              id
              name
            }
          }
          pricing {
            priceRangeUndiscounted {
              start {
                gross {
                  ...Money
                }
              }
              stop {
                gross {
                  ...Money
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;
export const useProductListQuery = makeQuery<ProductList, ProductListVariables>(
  productListQuery
);

const countAllProductsQuery = gql`
  query CountAllProducts {
    products {
      totalCount
    }
  }
`;
export const useCountAllProducts = makeQuery<CountAllProducts, null>(
  countAllProductsQuery
);

const productDetailsQuery = gql`
  ${productFragmentDetails}
  ${taxTypeFragment}
  query ProductDetails($id: ID!) {
    product(id: $id) {
      ...Product
    }
    taxTypes {
      ...TaxTypeFragment
    }
  }
`;
export const useProductDetails = makeQuery<
  ProductDetails,
  ProductDetailsVariables
>(productDetailsQuery);

const productVariantQuery = gql`
  ${fragmentVariant}
  query ProductVariantDetails($id: ID!) {
    productVariant(id: $id) {
      ...ProductVariant
    }
  }
`;
export const useProductVariantQuery = makeQuery<
  ProductVariantDetails,
  ProductVariantDetailsVariables
>(productVariantQuery);

const productVariantCreateQuery = gql`
  query ProductVariantCreateData($id: ID!) {
    product(id: $id) {
      id
      images {
        id
        sortOrder
        url
      }
      name
      productType {
        id
        variantAttributes {
          id
          slug
          name
          valueRequired
          values {
            id
            name
            slug
          }
        }
      }
      thumbnail {
        url
      }
      variants {
        id
        name
        sku
        images {
          id
          url
        }
      }
    }
  }
`;
export const useProductVariantCreateQuery = makeQuery<
  ProductVariantCreateData,
  ProductVariantCreateDataVariables
>(productVariantCreateQuery);

const productImageQuery = gql`
  query ProductImageById($productId: ID!, $imageId: ID!) {
    product(id: $productId) {
      id
      name
      mainImage: imageById(id: $imageId) {
        id
        alt
        url
      }
      images {
        id
        url(size: 48)
      }
    }
  }
`;
export const useProductImageQuery = makeQuery<
  ProductImageById,
  ProductImageByIdVariables
>(productImageQuery);

const availableInGridAttributes = gql`
  ${pageInfoFragment}
  query GridAttributes($first: Int!, $after: String, $ids: [ID!]!) {
    availableInGrid: attributes(
      first: $first
      after: $after
      filter: { availableInGrid: true, isVariantOnly: false }
    ) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }

    grid: attributes(first: 25, filter: { ids: $ids }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
export const useAvailableInGridAttributesQuery = makeQuery<
  GridAttributes,
  GridAttributesVariables
>(availableInGridAttributes);

const createMultipleVariantsData = gql`
  ${productVariantAttributesFragment}
  ${warehouseFragment}
  query CreateMultipleVariantsData($id: ID!) {
    product(id: $id) {
      ...ProductVariantAttributesFragment
    }
    warehouses(first: 20) {
      edges {
        node {
          ...WarehouseFragment
        }
      }
    }
  }
`;
export const useCreateMultipleVariantsData = makeQuery<
  CreateMultipleVariantsData,
  CreateMultipleVariantsDataVariables
>(createMultipleVariantsData);
