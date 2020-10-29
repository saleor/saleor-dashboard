import gql from "graphql-tag";

import { TypedQuery } from "../../queries";
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
