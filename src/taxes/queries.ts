import { gql } from "@apollo/client";

export const taxConfigurationsList = gql`
  query TaxConfigurationsList(
    $before: String
    $after: String
    $first: Int
    $last: Int
    $filter: TaxConfigurationFilterInput
  ) {
    taxConfigurations(before: $before, after: $after, first: $first, last: $last, filter: $filter) {
      edges {
        node {
          ...TaxConfiguration
        }
      }
    }
  }
`;

// Reading private tax configuration metadata requires HANDLE_TAXES or MANAGE_TAXES,
// and the Taxes pages are open to every staff user. Fetching it separately, only when
// the metadata dialog opens, keeps the list above working without that permission.
export const taxConfigurationMetadata = gql`
  query TaxConfigurationMetadata($id: ID!) {
    taxConfiguration(id: $id) {
      id
      ...Metadata
    }
  }
`;

export const taxCountriesList = gql`
  query TaxCountriesList {
    taxCountryConfigurations {
      ...TaxCountryConfiguration
    }
  }
`;

export const taxClassesList = gql`
  query TaxClassesList(
    $before: String
    $after: String
    $first: Int
    $last: Int
    $filter: TaxClassFilterInput
    $sortBy: TaxClassSortingInput
  ) {
    taxClasses(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      sortBy: $sortBy
    ) {
      edges {
        node {
          ...TaxClass
        }
      }
    }
  }
`;

export const taxClassAssign = gql`
  query TaxClassAssign($first: Int, $after: String) {
    taxClasses(first: $first, after: $after) {
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
`;

export const taxStrategyChoices = gql`
  query TaxStrategyChoices {
    shop {
      availableTaxApps {
        id
        name
        version
        identifier
        created
        brand {
          logo {
            default
          }
        }
      }
    }
  }
`;
