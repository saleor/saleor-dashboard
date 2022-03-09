import { gql } from "@apollo/client";

export const updateTaxSettings = gql`
  mutation UpdateTaxSettings($input: ShopSettingsInput!) {
    shopSettingsUpdate(input: $input) {
      errors {
        ...ShopSettingsUpdateErrorFragment
      }
      shop {
        ...ShopTaxes
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
          ...Country
        }
      }
    }
  }
`;
