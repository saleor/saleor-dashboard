import { gql } from "@apollo/client";

export const siteSettingsStaging = gql`
  query SiteSettingsStaging {
    shop {
      ...ShopStaging
    }
  }
`;
