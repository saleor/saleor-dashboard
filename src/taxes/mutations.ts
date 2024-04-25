import { gql } from "@apollo/client";

export const taxConfigurationUpdate = gql`
  mutation TaxConfigurationUpdate($id: ID!, $input: TaxConfigurationUpdateInput!) {
    taxConfigurationUpdate(id: $id, input: $input) {
      errors {
        ...TaxConfigurationUpdateError
      }
      taxConfiguration {
        ...TaxConfiguration
      }
    }
  }
`;

export const taxCountryConfigurationUpdate = gql`
  mutation TaxCountryConfigurationUpdate(
    $countryCode: CountryCode!
    $updateTaxClassRates: [TaxClassRateInput!]!
  ) {
    taxCountryConfigurationUpdate(
      countryCode: $countryCode
      updateTaxClassRates: $updateTaxClassRates
    ) {
      errors {
        ...TaxCountryConfigurationUpdateError
      }
      taxCountryConfiguration {
        ...TaxCountryConfiguration
      }
    }
  }
`;

export const taxCountryConfigurationDelete = gql`
  mutation TaxCountryConfigurationDelete($countryCode: CountryCode!) {
    taxCountryConfigurationDelete(countryCode: $countryCode) {
      errors {
        ...TaxCountryConfigurationDeleteError
      }
      taxCountryConfiguration {
        ...TaxCountryConfiguration
      }
    }
  }
`;

export const taxClassUpdate = gql`
  mutation TaxClassUpdate($id: ID!, $input: TaxClassUpdateInput!) {
    taxClassUpdate(id: $id, input: $input) {
      errors {
        ...TaxClassUpdateError
      }
      taxClass {
        ...TaxClass
      }
    }
  }
`;

export const taxClassCreate = gql`
  mutation TaxClassCreate($input: TaxClassCreateInput!) {
    taxClassCreate(input: $input) {
      errors {
        ...TaxClassCreateError
      }
      taxClass {
        ...TaxClass
      }
    }
  }
`;

export const taxClassDelete = gql`
  mutation TaxClassDelete($id: ID!) {
    taxClassDelete(id: $id) {
      errors {
        ...TaxClassDeleteError
      }
    }
  }
`;
