import { type ProductVariantSiblingFragment } from "@dashboard/graphql";

export type ProductVariantItem = ProductVariantSiblingFragment;

export type ProductVariantItemThumbnail = NonNullable<ProductVariantItem["media"]>[number];
