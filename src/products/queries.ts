import gql from "graphql-tag";

import makeQuery from "@saleor/hooks/makeQuery";
import { pageInfoFragment, TypedQuery } from "../queries";
import {
  AvailableInGridAttributes,
  AvailableInGridAttributesVariables
} from "./types/AvailableInGridAttributes";
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
import {
  InitialProductFilterData,
  InitialProductFilterDataVariables
} from "./types/InitialProductFilterData";

export const fragmentMoney = gql`
  fragment Money on Money {
    amount
    currency
  }
`;

export const fragmentProductImage = gql`
  fragment ProductImageFragment on ProductImage {
    id
    alt
    sortOrder
    url
  }
`;

export const productFragment = gql`
  ${fragmentMoney}
  fragment ProductFragment on Product {
    id
    name
    thumbnail {
      url
    }
    isAvailable
    basePrice {
      ...Money
    }
    productType {
      id
      name
    }
  }
`;
export const productFragmentDetails = gql`
  ${fragmentProductImage}
  ${fragmentMoney}
  fragment Product on Product {
    id
    name
    descriptionJson
    seoTitle
    seoDescription
    category {
      id
      name
    }
    collections {
      id
      name
    }
    basePrice {
      ...Money
    }
    margin {
      start
      stop
    }
    purchaseCost {
      start {
        ...Money
      }
      stop {
        ...Money
      }
    }
    isAvailable
    isPublished
    chargeTaxes
    publicationDate
    attributes {
      attribute {
        id
        slug
        name
        inputType
        valueRequired
        values {
          id
          name
          slug
        }
      }
      values {
        id
        name
        slug
      }
    }
    pricing {
      priceRange {
        start {
          net {
            ...Money
          }
        }
        stop {
          net {
            ...Money
          }
        }
      }
    }
    images {
      ...ProductImageFragment
    }
    variants {
      id
      sku
      name
      priceOverride {
        ...Money
      }
      margin
      quantity
      quantityAllocated
      stockQuantity
    }
    productType {
      id
      name
      hasVariants
    }
    url
  }
`;

export const fragmentVariant = gql`
  ${fragmentMoney}
  ${fragmentProductImage}
  fragment ProductVariant on ProductVariant {
    id
    attributes {
      attribute {
        id
        name
        slug
        valueRequired
        values {
          id
          name
          slug
        }
      }
      values {
        id
        name
        slug
      }
    }
    costPrice {
      ...Money
    }
    images {
      id
      url
    }
    name
    priceOverride {
      ...Money
    }
    product {
      id
      images {
        ...ProductImageFragment
      }
      name
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
    sku
    quantity
    quantityAllocated
  }
`;

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
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
export const TypedProductListQuery = TypedQuery<
  ProductList,
  ProductListVariables
>(productListQuery);

const productDetailsQuery = gql`
  ${productFragmentDetails}
  query ProductDetails($id: ID!) {
    product(id: $id) {
      ...Product
      productType {
        variantAttributes {
          id
          name
          values {
            id
            name
            slug
          }
        }
      }
    }
  }
`;
export const TypedProductDetailsQuery = TypedQuery<
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
export const TypedProductVariantQuery = TypedQuery<
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
export const TypedProductVariantCreateQuery = TypedQuery<
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
export const TypedProductImageQuery = TypedQuery<
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
export const AvailableInGridAttributesQuery = TypedQuery<
  AvailableInGridAttributes,
  AvailableInGridAttributesVariables
>(availableInGridAttributes);
