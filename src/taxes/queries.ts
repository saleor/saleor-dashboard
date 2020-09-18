import {
  countryWithTaxesFragment,
  shopTaxesFragment
} from "@saleor/fragments/taxes";
import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { CountryList } from "./types/CountryList";

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
