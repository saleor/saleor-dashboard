import { gql } from "@apollo/client";

export const siteSettings = gql`
  query SiteSettings {
    shop {
      ...Shop
    }
  }
`;

// Reading private shop metadata requires MANAGE_SETTINGS, so it is fetched separately,
// only when the metadata dialog opens, and never as part of the shared Shop fragment.
export const shopMetadata = gql`
  query ShopMetadata {
    shop {
      id
      ...Metadata
    }
  }
`;
