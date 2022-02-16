import { gql } from "@apollo/client";

export const updateTaxSettings = gql`
  mutation UpdateTaxSettings($input: ShopSettingsInput!) {
    shopSettingsUpdate(input: $input) {
      errors {
        ...ShopSettingsUpdateErrorFragment
      }
      shop {
        ...ShopTaxesFragment
      }
    }
  }
`;

export const fetchTaxes = gql`
  mutation FetchTaxes {
    shopFetchTaxRates {
      errors {
        ...ShopFetchTaxRatesErrorFragment
      }
      shop {
        countries {
          ...CountryFragment
        }
      }
    }
  }
`;
