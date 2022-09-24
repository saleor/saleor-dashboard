import { gql } from "@apollo/client";

export const countryList = gql`
  query CountryList {
    shop {
      ...ShopTaxes
      countries {
        ...CountryWithTaxes
      }
    }
  }
`;

export const taxTypeList = gql`
  query TaxTypeList {
    taxTypes {
      ...TaxType
    }
  }
`;

export const taxConfigurationsList = gql`
  query TaxConfigurationsList(
    $before: String
    $after: String
    $first: Int
    $last: Int
    $filter: TaxConfigurationFilterInput
  ) {
    taxConfigurations(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
    ) {
      edges {
        node {
          ...TaxConfiguration
        }
      }
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
