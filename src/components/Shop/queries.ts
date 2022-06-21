import { gql } from "@apollo/client";
import {
  RefreshLimitsQuery,
  RefreshLimitsQueryVariables,
  useRefreshLimitsQuery,
} from "@saleor/graphql";
import { QueryHookOptions } from "@saleor/hooks/graphql";

export const shopInfo = gql`
  query ShopInfo {
    shop {
      countries {
        ...CountryWithCode
      }
      defaultCountry {
        ...CountryWithCode
      }
      defaultWeightUnit
      displayGrossPrices
      domain {
        host
        url
      }
      languages {
        ...Language
      }
      includeTaxesInPrices
      name
      trackInventoryByDefault
      permissions {
        code
        name
      }
      version
    }
  }
`;

export const shopCountries = gql`
  query ShopCountries($filter: CountryFilterInput) {
    shop {
      countries(filter: $filter) {
        code
        country
      }
    }
  }
`;

const limitVariables: Record<keyof RefreshLimitsQueryVariables, boolean> = {
  channels: false,
  orders: false,
  productVariants: false,
  staffUsers: false,
  warehouses: false,
};

export const limitInfo = gql`
  query RefreshLimits(
    $channels: Boolean!
    $orders: Boolean!
    $productVariants: Boolean!
    $staffUsers: Boolean!
    $warehouses: Boolean!
  ) {
    shop {
      ...ShopLimit
    }
  }
`;
export const useShopLimitsQuery = (
  opts: QueryHookOptions<
    RefreshLimitsQuery,
    Partial<RefreshLimitsQueryVariables>
  >,
) =>
  useRefreshLimitsQuery({
    ...opts,
    variables: {
      ...limitVariables,
      ...opts.variables,
    },
  });
