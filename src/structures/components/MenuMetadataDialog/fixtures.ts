import { type MenuMetadataQuery } from "@dashboard/graphql";

type MenuWithMetadata = NonNullable<MenuMetadataQuery["menu"]>;

export const menuMetadataMenuId = "TWVudTox";

export const createMenuWithMetadata = (placement: string): MenuWithMetadata => ({
  __typename: "Menu",
  id: menuMetadataMenuId,
  metadata: [
    { __typename: "MetadataItem", key: "nav.placement", value: placement },
    { __typename: "MetadataItem", key: "nav.maxDepth", value: "2" },
  ],
  privateMetadata: [{ __typename: "MetadataItem", key: "cms.sourceId", value: "nav-42" }],
});

export const createMenuMetadata = (placement: string): MenuMetadataQuery => ({
  __typename: "Query",
  menu: createMenuWithMetadata(placement),
});
