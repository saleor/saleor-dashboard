import { shopFragment } from "@saleor/fragments/shop";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { SiteSettings } from "./types/SiteSettings";

const siteSettings = gql`
  ${shopFragment}
  query SiteSettings {
    shop {
      ...ShopFragment
    }
  }
`;
export const useSiteSettingsQuery = makeQuery<SiteSettings, {}>(siteSettings);
