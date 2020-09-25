import {
  countryWithTaxesFragment,
  shopTaxesFragment,
  taxTypeFragment
} from "@saleor/fragments/taxes";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { CountryList } from "./types/CountryList";
import { TaxTypeList } from "./types/TaxTypeList";

const countryList = gql`
  ${countryWithTaxesFragment}
  ${shopTaxesFragment}
  query CountryList {
    shop {
      ...ShopTaxesFragment
      countries {
        ...CountryWithTaxesFragment
      }
    }
  }
`;
export const TypedCountryListQuery = TypedQuery<CountryList, {}>(countryList);

const taxTypeList = gql`
  ${taxTypeFragment}
  query TaxTypeList {
    taxTypes {
      ...TaxTypeFragment
    }
  }
`;
export const useTaxTypeList = makeQuery<TaxTypeList, {}>(taxTypeList);
