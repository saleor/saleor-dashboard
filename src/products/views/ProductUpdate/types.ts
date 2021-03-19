import { ProductDetails_product_variants } from "@saleor/products/types/ProductDetails";

export interface ChannelWithVariantData {
  hasChanged: boolean;
  selectedVariants: ProductDetails_product_variants[];
  variantsIdsToRemove: string[];
  variantsIdsToAdd: string[];
}

export interface ChannelsWithVariantsData {
  [id: string]: ChannelWithVariantData;
}

export const initialChannelWithVariantData: Partial<ChannelWithVariantData> = {
  hasChanged: false,
  variantsIdsToRemove: [],
  variantsIdsToAdd: []
};
