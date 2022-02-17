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
