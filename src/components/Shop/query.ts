import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

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
export const useShopInfoQuery = makeQuery<ShopInfo, {}>(shopInfo);
