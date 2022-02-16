import { gql } from "@apollo/client";

export const countryList = gql`
  query CountryList {
    shop {
      ...ShopTaxesFragment
      countries {
        ...CountryWithTaxesFragment
      }
    }
  }
`;

export const taxTypeList = gql`
  query TaxTypeList {
    taxTypes {
      ...TaxTypeFragment
    }
  }
`;
