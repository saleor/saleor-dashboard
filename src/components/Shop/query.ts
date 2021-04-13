import { limitFragment } from "@saleor/fragments/shop";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { TypedQuery } from "../../queries";
import { RefreshLimits, RefreshLimitsVariables } from "./types/RefreshLimits";
import { ShopInfo } from "./types/ShopInfo";

const shopInfo = gql`
  query ShopInfo {
    shop {
      countries {
        country
        code
      }
      defaultCountry {
        code
        country
      }
      defaultWeightUnit
      displayGrossPrices
      domain {
        host
        url
      }
      languages {
        code
        language
      }
      includeTaxesInPrices
      name
      trackInventoryByDefault
      permissions {
        code
        name
      }
    }
  }
`;
export const TypedShopInfoQuery = TypedQuery<ShopInfo, {}>(shopInfo);

const limitInfo = gql`
  ${limitFragment}
  query RefreshLimits(
    $channels: Boolean = false
    $orders: Boolean = false
    $productVariants: Boolean = false
    $staffUsers: Boolean = false
    $warehouses: Boolean = false
  ) {
    shop {
      ...ShopLimitFragment
    }
  }
`;
export const useShopLimitsQuery = makeQuery<
  RefreshLimits,
  RefreshLimitsVariables
>(limitInfo);
