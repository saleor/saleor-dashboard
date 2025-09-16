import { ProductVariantCreateDataQuery, ProductVariantDetailsQuery } from "@dashboard/graphql";

export type ProductVariantItem = NonNullable<
  | ProductVariantDetailsQuery["productVariant"]
  | NonNullable<NonNullable<ProductVariantCreateDataQuery["product"]>["variants"]>[number]
>;

type ProductVariantItems = ProductVariantItem[];

export type ProductVariantItemThumbnail = NonNullable<ProductVariantItem["media"]>[number];
