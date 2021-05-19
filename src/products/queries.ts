import { attributeValueFragment } from "@saleor/fragments/attributes";
import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import {
  fragmentVariant,
  productFragment,
  productFragmentDetails,
  productVariantAttributesFragment,
  variantAttributeFragment
} from "@saleor/fragments/products";
import { taxTypeFragment } from "@saleor/fragments/taxes";
import { warehouseFragment } from "@saleor/fragments/warehouses";
import makeQuery from "@saleor/hooks/makeQuery";
import {
  ProductMediaById,
  ProductMediaByIdVariables
} from "@saleor/products/types/ProductMediaById";
import gql from "graphql-tag";

import {
  CreateMultipleVariantsData,
  CreateMultipleVariantsDataVariables
} from "./types/CreateMultipleVariantsData";
import {
  GridAttributes,
  GridAttributesVariables
} from "./types/GridAttributes";
import {
  InitialProductFilterAttributes,
  InitialProductFilterAttributesVariables
} from "./types/InitialProductFilterAttributes";
import {
  InitialProductFilterCategories,
  InitialProductFilterCategoriesVariables
} from "./types/InitialProductFilterCategories";
import {
  InitialProductFilterCollections,
  InitialProductFilterCollectionsVariables
} from "./types/InitialProductFilterCollections";
import {
  InitialProductFilterProductTypes,
  InitialProductFilterProductTypesVariables
} from "./types/InitialProductFilterProductTypes";
import { ProductCount, ProductCountVariables } from "./types/ProductCount";
import {
  ProductDetails,
  ProductDetailsVariables
} from "./types/ProductDetails";
import { ProductList, ProductListVariables } from "./types/ProductList";
import { ProductType, ProductTypeVariables } from "./types/ProductType";
import {
  ProductVariantCreateData,
  ProductVariantCreateDataVariables
} from "./types/ProductVariantCreateData";
import {
  ProductVariantDetails,
  ProductVariantDetailsVariables
} from "./types/ProductVariantDetails";

const initialProductFilterAttributesQuery = gql`
  ${pageInfoFragment}
  query InitialProductFilterAttributes(
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attributes(
      first: 100
      filter: { filterableInDashboard: true, type: PRODUCT_TYPE }
    ) {
      edges {
        node {
          id
          name
          slug
          values(
            first: $firstValues
            after: $afterValues
            last: $lastValues
            before: $beforeValues
          ) {
            pageInfo {
              ...PageInfoFragment
            }
            edges {
              cursor
              node {
                id
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;
export const useInitialProductFilterAttributesQuery = makeQuery<
  InitialProductFilterAttributes,
  InitialProductFilterAttributesVariables
>(initialProductFilterAttributesQuery);

const initialProductFilterCategoriesQuery = gql`
  query InitialProductFilterCategories($categories: [ID!]) {
    categories(first: 100, filter: { ids: $categories }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
export const useInitialProductFilterCategoriesQuery = makeQuery<
  InitialProductFilterCategories,
  InitialProductFilterCategoriesVariables
>(initialProductFilterCategoriesQuery);

const initialProductFilterCollectionsQuery = gql`
  query InitialProductFilterCollections($collections: [ID!]) {
    collections(first: 100, filter: { ids: $collections }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
export const useInitialProductFilterCollectionsQuery = makeQuery<
  InitialProductFilterCollections,
  InitialProductFilterCollectionsVariables
>(initialProductFilterCollectionsQuery);

const initialProductFilterProductTypesQuery = gql`
  query InitialProductFilterProductTypes($productTypes: [ID!]) {
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
export const useInitialProductFilterProductTypesQuery = makeQuery<
  InitialProductFilterProductTypes,
  InitialProductFilterProductTypesVariables
>(initialProductFilterProductTypesQuery);

const productListQuery = gql`
  ${productFragment}
  ${attributeValueFragment}
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
              ...AttributeValueFragment
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

const productCountQuery = gql`
  query ProductCount($filter: ProductFilterInput) {
    products(filter: $filter) {
      totalCount
    }
  }
`;

export const useProductCountQuery = makeQuery<
  ProductCount,
  ProductCountVariables
>(productCountQuery);

const productDetailsQuery = gql`
  ${productFragmentDetails}
  ${taxTypeFragment}
  query ProductDetails(
    $id: ID!
    $channel: String
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    product(id: $id, channel: $channel) {
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

const productTypeQuery = gql`
  ${taxTypeFragment}
  ${attributeValueFragment}
  query ProductType($id: ID!) {
    productType(id: $id) {
      id
      name
      hasVariants
      productAttributes {
        id
        inputType
        entityType
        slug
        name
        valueRequired
        unit
        # values {
        #   ...AttributeValueFragment
        # }
      }
      taxType {
        ...TaxTypeFragment
      }
    }
  }
`;
export const useProductTypeQuery = makeQuery<ProductType, ProductTypeVariables>(
  productTypeQuery
);

const productVariantQuery = gql`
  ${fragmentVariant}
  query ProductVariantDetails(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
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
  ${variantAttributeFragment}
  query ProductVariantCreateData(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    product(id: $id) {
      id
      media {
        id
        sortOrder
        url
      }
      channelListings {
        channel {
          id
          name
          currencyCode
        }
      }
      name
      productType {
        id
        selectionVariantAttributes: variantAttributes(
          variantSelection: VARIANT_SELECTION
        ) {
          ...VariantAttributeFragment
        }
        nonSelectionVariantAttributes: variantAttributes(
          variantSelection: NOT_VARIANT_SELECTION
        ) {
          ...VariantAttributeFragment
        }
      }
      thumbnail {
        url
      }
      variants {
        id
        name
        sku
        media {
          id
          url
          type
        }
      }
    }
  }
`;
export const useProductVariantCreateQuery = makeQuery<
  ProductVariantCreateData,
  ProductVariantCreateDataVariables
>(productVariantCreateQuery);

const productMediaQuery = gql`
  query ProductMediaById($productId: ID!, $mediaId: ID!) {
    product(id: $productId) {
      id
      name
      mainImage: mediaById(id: $mediaId) {
        id
        alt
        url
        type
        oembedData
      }
      media {
        id
        url(size: 48)
        alt
        type
        oembedData
      }
    }
  }
`;
export const useProductMediaQuery = makeQuery<
  ProductMediaById,
  ProductMediaByIdVariables
>(productMediaQuery);

const availableInGridAttributes = gql`
  ${pageInfoFragment}
  query GridAttributes($first: Int!, $after: String, $ids: [ID!]!) {
    availableInGrid: attributes(
      first: $first
      after: $after
      filter: {
        availableInGrid: true
        isVariantOnly: false
        type: PRODUCT_TYPE
      }
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
  query CreateMultipleVariantsData(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
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
