import {
  SearchCategoriesOpts,
  SearchCollectionOpts,
  SearchProductsOpts,
} from "@dashboard/discounts/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { v4 as uuidv4 } from "uuid";

import { VoucherCode } from "../VoucherCodesDatagrid/types";
import { FormData } from "./types";

export const generateDraftVoucherCode = (code: string) => {
  return {
    code,
    status: "Draft",
  };
};

export const generateMultipleVoucherCodes = (quantity: string, prefix?: string) => {
  return Array.from({ length: Number(quantity) }).map(() =>
    generateDraftVoucherCode(prefix ? `${prefix}-${uuidv4()}` : uuidv4()),
  );
};

export const voucherCodeExists = (code: string, voucherCodes: VoucherCode[]) => {
  return voucherCodes.some(voucherCode => voucherCode.code === code);
};

export const getFilteredCategories = (
  data: FormData,
  searchCategoriesOpts: SearchCategoriesOpts,
) => {
  const categories = mapEdgesToItems(searchCategoriesOpts?.data?.search);
  const excludedCategoryIds = data.categories.map(category => category.id);

  return (
    categories?.filter(suggestedCategory => !excludedCategoryIds.includes(suggestedCategory.id)) ??
    []
  );
};

export const getFilteredCollections = (
  data: FormData,
  searchCollectionsOpts: SearchCollectionOpts,
) => {
  const collections = mapEdgesToItems(searchCollectionsOpts?.data?.search);
  const excludedCollectionIds = data.collections.map(collection => collection.id);

  return (
    collections?.filter(
      suggestedCollection => !excludedCollectionIds.includes(suggestedCollection.id),
    ) ?? []
  );
};

export const getFilteredProducts = (data: FormData, searchProductsOpts: SearchProductsOpts) => {
  const products = mapEdgesToItems(searchProductsOpts?.data?.search);
  const excludedProductIds = data.products.map(product => product.id);

  return (
    products?.filter(suggestedProduct => !excludedProductIds.includes(suggestedProduct.id)) ?? []
  );
};

export const getFilteredProductVariants = (
  data: FormData,
  searchProductsOpts: SearchProductsOpts,
) => {
  const products = mapEdgesToItems(searchProductsOpts?.data?.search);
  const excludedVariantIds = data.variants.map(variant => variant.id);

  return products?.map(product => ({
    ...product,
    variants:
      product?.variants?.filter(
        suggestedVariant => !excludedVariantIds.includes(suggestedVariant.id),
      ) ?? [],
  }));
};

export const mapLocalVariantsToSavedVariants = (variants: FormData["variants"]) => {
  return {
    __typename: "ProductVariantCountableConnection",
    edges: variants.map(variant => ({
      node: {
        __typename: "ProductVariant",
        id: variant.id,
        name: variant.name,
        product: {
          __typename: "Product",
          id: variant.product.id,
          name: variant.product.name,
          thumbnail: variant.product.thumbnail,
          productType: {
            __typename: "ProductType",
            id: variant.product.productType.id,
            name: variant.product.productType.name,
          },
        },
      },
    })),
  };
};
