export const collectionSectionIds = {
  general: "collection-section-general",
  media: "collection-section-media",
  products: "collection-section-products",
  seo: "collection-section-seo",
} as const;

export type CollectionSectionId = (typeof collectionSectionIds)[keyof typeof collectionSectionIds];
