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

export const taxConfigurationList = gql`
  query taxConfigurationList(
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
