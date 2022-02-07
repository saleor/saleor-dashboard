import { gql } from "@apollo/client";
import { shopFragment } from "@saleor/fragments/shop";

import { TypedQuery } from "../queries";
import { SiteSettings } from "./types/SiteSettings";

const siteSettings = gql`
  ${shopFragment}
  query SiteSettings {
    shop {
      ...ShopFragment
    }
  }
`;
export const TypedSiteSettingsQuery = TypedQuery<SiteSettings, {}>(
  siteSettings
);
