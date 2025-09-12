import { gql } from "@apollo/client";

export const initialDynamicLeftOperands = gql`
  query _GetDynamicLeftOperands($first: Int!, $query: String!) {
    attributes(
      first: $first
      search: $query
      where: {
        type: { eq: PRODUCT_TYPE }
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

  query _SearchAttributeOperands($attributesSlugs: [String!], $choicesIds: [ID!], $first: Int!) {
    attributes(first: $first, filter: { slugs: $attributesSlugs }) {
      edges {
        node {
          id
          name
          slug
          inputType
          entityType
          choices(first: 5, filter: { ids: $choicesIds }) {
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
  query _GetAttributeChoices($slug: String!, $first: Int!, $query: String!) {
    attribute(slug: $slug) {
      choices(first: $first, filter: { search: $query }) {
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

  query _GetCollectionsChoices($first: Int!, $query: String!) {
    collections(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _GetCategoriesChoices($first: Int!, $query: String!) {
    categories(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _GetProductTypesChoices($first: Int!, $query: String!) {
    productTypes(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _GetPageTypesChoices($first: Int!, $query: String!) {
    pageTypes(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _GetPagesChoices($first: Int!, $query: String!) {
    pages(first: $first, filter: { search: $query }) {
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

  query _GetProductChoices($first: Int!, $query: String!) {
    products(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _GetProductVariantChoices($first: Int!, $query: String!) {
    productVariants(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug: id
          originalSlug: name
          product {
            name
          }
        }
      }
    }
  }

  query _GetGiftCardTagsChoices($first: Int!, $query: String!) {
    giftCardTags(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }

  query _GetCustomersChoices($first: Int!, $query: String!) {
    customers(first: $first, filter: { search: $query }) {
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
            name
          }
        }
      }
    }
  }

  query _GetWarehouseChoices($first: Int!, $query: String!) {
    warehouses(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
        }
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
