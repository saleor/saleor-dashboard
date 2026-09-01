import { type MediaFragment } from "@dashboard/graphql/staging";

/** Owners of a generic media gallery, other than `Product` which keeps the legacy mutations. */
export type MediaOwnerTypename = "Category" | "Collection" | "Page";

/** The `Media` fragment as returned for one of the non-product owners. */
export type EntityMedia = Extract<
  MediaFragment,
  { __typename: "CategoryMedia" | "CollectionMedia" | "PageMedia" }
>;
