import { gql } from "@apollo/client";

export const siteSettings = gql`
  query SiteSettings {
    shop {
      ...Shop
    }
  }
`;
