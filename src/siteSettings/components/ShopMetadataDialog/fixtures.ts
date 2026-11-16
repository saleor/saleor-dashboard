import { type ShopMetadataQuery } from "@dashboard/graphql";

export const createShopMetadata = (legalName: string): ShopMetadataQuery => ({
  __typename: "Query",
  shop: {
    __typename: "Shop",
    id: "U2hvcDox",
    metadata: [
      { __typename: "MetadataItem", key: "seller.legalName", value: legalName },
      { __typename: "MetadataItem", key: "seller.vatId", value: "DE000000000" },
    ],
    privateMetadata: [{ __typename: "MetadataItem", key: "carrier.ioss", value: "IM1234567890" }],
  },
});
