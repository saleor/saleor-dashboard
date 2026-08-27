import { gql } from "@apollo/client";

export const initialDynamicLeftOperands = gql`
  query _GetDynamicLeftOperands(
    $first: Int!
    $query: String!
    $type: AttributeTypeEnum!
    $after: String
  ) {
    attributes(
      first: $first
      after: $after
      search: $query
      where: {
        type: { eq: $type }
        inputType: {
          oneOf: [
            DROPDOWN
            MULTISELECT
            BOOLEAN
            NUMERIC
            DATE
            DATE_TIME
            SWATCH
            REFERENCE
            SINGLE_REFERENCE
          ]
        }
      }
    ) {
      edges {
        node {
          id
          name
          slug
          inputType
          entityType
          __typename
        }
        __typename
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      __typename
    }
  }
`;

export const initialDynamicOperands = gql`
  query _GetChannelOperands {
    channels {
      id: slug
      name
      slug
    }
  }

  query _GetLegacyChannelOperands {
    channels {
      id
      name
      slug
    }
  }

  query _SearchCollectionsOperands($first: Int!, $collectionsSlugs: [String!]) {
    collections(first: $first, filter: { slugs: $collectionsSlugs }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _SearchCategoriesOperands($after: String, $first: Int!, $categoriesSlugs: [String!]) {
    categories(after: $after, first: $first, filter: { slugs: $categoriesSlugs }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _SearchProductTypesOperands($after: String, $first: Int!, $productTypesSlugs: [String!]) {
    productTypes(after: $after, first: $first, filter: { slugs: $productTypesSlugs }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _SearchPageTypesOperands($first: Int!, $pageTypesSlugs: [String!]) {
    pageTypes(first: $first, filter: { slugs: $pageTypesSlugs }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _SearchCustomerTypesOperands($first: Int!, $customerTypesSlugs: [String!]) {
    customerTypes(first: $first, where: { slug: { oneOf: $customerTypesSlugs } }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _SearchAttributeOperands(
    $attributesSlugs: [String!]
    $choicesIds: [ID!]
    $first: Int!
    $choicesFirst: Int!
  ) {
    attributes(first: $first, filter: { slugs: $attributesSlugs }) {
      edges {
        node {
          id
          name
          slug
          inputType
          entityType
          choices(first: $choicesFirst, filter: { ids: $choicesIds }) {
            edges {
              node {
                slug: id
                id
                name
                originalSlug: slug
              }
            }
          }
        }
      }
    }
  }
`;

export const dynamicOperandsQueries = gql`
  query _GetAttributeChoices($slug: String!, $first: Int!, $query: String!, $after: String) {
    attribute(slug: $slug) {
      choices(first: $first, after: $after, filter: { search: $query }) {
        edges {
          node {
            slug: id
            id
            name
            originalSlug: slug
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }

  query _GetCollectionsChoices($first: Int!, $query: String!, $after: String) {
    collections(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetCategoriesChoices($first: Int!, $query: String!, $after: String) {
    categories(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetProductTypesChoices($first: Int!, $query: String!, $after: String) {
    productTypes(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetPageTypesChoices($first: Int!, $query: String!, $after: String) {
    pageTypes(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetCustomerTypesChoices($first: Int!, $query: String!, $after: String) {
    customerTypes(first: $first, after: $after, search: $query) {
      edges {
        node {
          id
          name
          slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetPagesChoices($first: Int!, $query: String!, $after: String) {
    pages(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name: title
          slug
          originalSlug: slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetProductChoices($first: Int!, $query: String!, $after: String) {
    products(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
          thumbnail(size: 64) {
            url
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetProductVariantChoices($first: Int!, $query: String!, $after: String) {
    productVariants(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug: id
          originalSlug: name
          product {
            id
            name
            thumbnail(size: 64) {
              url
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetProductVariantChoicesByProduct(
    $first: Int!
    $query: String!
    $after: String
    $variantsFirst: Int!
  ) {
    products(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          thumbnail(size: 64) {
            url
          }
          productVariants(first: $variantsFirst) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetGiftCardTagsChoices($first: Int!, $query: String!, $after: String) {
    giftCardTags(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _GetCustomersChoices($first: Int!, $query: String!, $after: String) {
    customers(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          email
          firstName
          lastName
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _SearchCustomersOperands($first: Int!, $customersIds: [ID!]) {
    customers(first: $first, filter: { ids: $customersIds }) {
      edges {
        node {
          id
          email
          firstName
          lastName
        }
      }
    }
  }

  query _SearchPageOperands($first: Int!, $pageSlugs: [String!]) {
    pages(first: $first, filter: { slugs: $pageSlugs }) {
      edges {
        node {
          id
          name: title
          slug
          originalSlug: slug
        }
      }
    }
  }

  query _SearchProductOperands($first: Int!, $productSlugs: [String!]) {
    products(first: $first, where: { slug: { oneOf: $productSlugs } }) {
      edges {
        node {
          id
          name
          slug
          originalSlug: slug
          thumbnail(size: 64) {
            url
          }
        }
      }
    }
  }

  query _SearchProductVariantOperands($first: Int!, $ids: [ID!]) {
    productVariants(first: $first, where: { ids: $ids }) {
      edges {
        node {
          id
          name
          slug: id
          originalSlug: name
          product {
            id
            name
            thumbnail(size: 64) {
              url
            }
          }
        }
      }
    }
  }

  query _GetWarehouseChoices($first: Int!, $query: String!, $after: String) {
    warehouses(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }

  query _SearchWarehouseOperands($first: Int!, $warehouseSlugs: [String!]) {
    warehouses(first: $first, filter: { slugs: $warehouseSlugs }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;
