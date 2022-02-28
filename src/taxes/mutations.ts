import { gql } from "@apollo/client";
import {
  shopFetchTaxRatesErrorFragment,
  shopSettingsUpdateErrorFragment
} from "@saleor/fragments/errors";
import { countryFragment, shopTaxesFragment } from "@saleor/fragments/taxes";
import makeMutation from "@saleor/hooks/makeMutation";

import { TypedMutation } from "../mutations";
import { FetchTaxes } from "./types/FetchTaxes";
import {
  UpdateTaxSettings,
  UpdateTaxSettingsVariables
} from "./types/UpdateTaxSettings";

const updateTaxSettings = gql`
  ${shopSettingsUpdateErrorFragment}
  ${shopTaxesFragment}
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

export const useTaxSettingsUpdateMutation = makeMutation<
  UpdateTaxSettings,
  UpdateTaxSettingsVariables
>(updateTaxSettings);

const fetchTaxes = gql`
  ${countryFragment}
  ${shopFetchTaxRatesErrorFragment}
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
export const TypedFetchTaxes = TypedMutation<FetchTaxes, {}>(fetchTaxes);
