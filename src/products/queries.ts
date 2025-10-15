import { gql } from "@apollo/client";

export const productListQuery = gql`
  query ProductList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: ProductFilterInput
    $search: String
    $where: ProductWhereInput
    $channel: String
    $sort: ProductOrder
    $hasChannel: Boolean!
    $includeCategories: Boolean!
    $includeCollections: Boolean!
  ) {
    products(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      search: $search
      where: $where
      sortBy: $sort
      channel: $channel
    ) {
      edges {
        node {
          ...ProductWithChannelListings
          updatedAt
          created
          description
          attributes {
            ...ProductListAttribute
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
export const productCountQuery = gql`
  query ProductCount($filter: ProductFilterInput, $channel: String) {
    products(filter: $filter, channel: $channel) {
      totalCount
    }
  }
`;

export const productDetailsQuery = gql`
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
      category {
        ...CategoryWithAncestors
      }
    }
  }
`;

export const productTypeQuery = gql`
  query ProductType(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    productType(id: $id) {
      id
      name
      hasVariants
      productAttributes {
        ...AttributeDetails
      }
      taxClass {
        id
        name
      }
    }
  }
`;
export const productVariantQuery = gql`
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

export const productVariantCreateQuery = gql`
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
        isPublished
        publishedAt
        channel {
          id
          name
          currencyCode
        }
      }
      name
      productType {
        id
        selectionVariantAttributes: variantAttributes(variantSelection: VARIANT_SELECTION) {
          ...VariantAttribute
        }
        nonSelectionVariantAttributes: variantAttributes(variantSelection: NOT_VARIANT_SELECTION) {
          ...VariantAttribute
        }
      }
      thumbnail {
        url
      }
      defaultVariant {
        id
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

export const productMediaQuery = gql`
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

export const gridAttributes = gql`
  query GridAttributes($ids: [ID!]!, $hasAttributes: Boolean!, $type: AttributeTypeEnum!) {
    availableAttributes: attributes(first: 10, filter: { type: $type }) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
    selectedAttributes: attributes(first: 25, filter: { ids: $ids }) @include(if: $hasAttributes) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const availableColumnAttribues = gql`
  query AvailableColumnAttributes(
    $search: String!
    $type: AttributeTypeEnum!
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    attributes(
      filter: { search: $search, type: $type }
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const gridWarehouses = gql`
  query GridWarehouses($ids: [ID!]!, $hasWarehouses: Boolean!) {
    availableWarehouses: warehouses(first: 10) {
      edges {
        node {
          ...Warehouse
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
    selectedWarehouses: warehouses(first: 100, filter: { ids: $ids }) @include(if: $hasWarehouses) {
      edges {
        node {
          ...Warehouse
        }
      }
    }
  }
`;

export const defaultGraphiQLQuery = `query ProductDetails($id: ID!) {
  product(id: $id) {
    id
    name
    slug
    description
  }
}`;
