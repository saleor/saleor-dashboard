import { shopFragment } from "@saleor/fragments/shop";
import gql from "graphql-tag";

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
