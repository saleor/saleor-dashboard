import { gql } from "@apollo/client";

export const initialDynamicLeftOperands = gql`
  query _GetInitialDynamicLeftOperands {
    attributes(first: 100, filter: { type: PRODUCT_TYPE }) {
      edges {
        node {
          id
          name
          slug
          inputType
        }
      }
    }
  }
`;

export const initialDynamicOperands = gql`
  query _GetChannelOperands {
    channels {
      id
      name
      slug
    }
  }

  query _SearchCollectionsOperands($first: Int!, $collectionsSlugs: [String!]) {
    search: collections(first: $first, filter: { slugs: $collectionsSlugs }) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _SearchCategoriesOperands(
    $after: String
    $first: Int!
    $categoriesSlugs: [String!]
  ) {
    search: categories(
      after: $after
      first: $first
      filter: { slugs: $categoriesSlugs }
    ) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }

  query _SearchProductTypesOperands(
    $after: String
    $first: Int!
    $productTypesSlugs: [String!]
  ) {
    search: productTypes(
      after: $after
      first: $first
      filter: { slugs: $productTypesSlugs }
    ) {
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
  ) {
    search: attributes(first: $first, filter: { slugs: $attributesSlugs }) {
      edges {
        node {
          id
          name
          slug
          inputType
          choices(first: 5, filter: { ids: $choicesIds }) {
            edges {
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

export const dynamicOperandsQueries = gql`
  query _GetAttributeChoices($attributeId: ID!, $first: Int!, $query: String!) {
    attribute(id: $attributeId) {
      choices(first: $first, filter: { search: $query }) {
        edges {
          node {
            id
            name
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
        }
      }
    }
  }
`;
