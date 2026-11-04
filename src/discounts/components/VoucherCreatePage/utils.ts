import {
  type CategoryWithTotalProductsFragment,
  type CollectionWithTotalProductsFragment,
  type SearchProductFragment,
  type VoucherCatalogueFragment,
} from "@dashboard/graphql";

import { type VoucherCode } from "../VoucherCodesDatagrid/types";
import { type FormData, VoucherCreatePageTab, type VoucherCreateProductVariant } from "./types";

export const generateDraftVoucherCode = (code: string) => {
  return {
    code,
    status: "Draft",
  };
};

export const generateMultipleVoucherCodes = (quantity: string, prefix?: string) => {
  return Array.from({ length: Number(quantity) }).map(() =>
    generateDraftVoucherCode(prefix ? `${prefix}-${crypto.randomUUID()}` : crypto.randomUUID()),
  );
};

export const voucherCodeExists = (code: string, voucherCodes: VoucherCode[]) => {
  return voucherCodes.some(voucherCode => voucherCode.code === code);
};

export const getAssignedVariantIdsFromForm = (data: Pick<FormData, "variants">): string[] =>
  data.variants.map(variant => variant.id);

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

type CreateCatalogueItem =
  | CategoryWithTotalProductsFragment
  | CollectionWithTotalProductsFragment
  | SearchProductFragment
  | VoucherCreateProductVariant;

interface CreateCatalogueLists {
  categories: CategoryWithTotalProductsFragment[];
  collections: CollectionWithTotalProductsFragment[];
  products: SearchProductFragment[];
  variants: VoucherCatalogueFragment["variants"];
}

/**
 * The create page paginates only the open catalogue group, so `pageItems` holds that group's
 * items. Only that group gets them; the collapsed groups get nothing, so items are never read
 * as another type (mapping a category as a variant crashed the page).
 */
export const getCreateCatalogueLists = ({
  activeTab,
  pageItems,
}: {
  activeTab: VoucherCreatePageTab;
  pageItems: CreateCatalogueItem[];
}): CreateCatalogueLists => ({
  categories:
    activeTab === VoucherCreatePageTab.categories
      ? (pageItems as CategoryWithTotalProductsFragment[])
      : [],
  collections:
    activeTab === VoucherCreatePageTab.collections
      ? (pageItems as CollectionWithTotalProductsFragment[])
      : [],
  products:
    activeTab === VoucherCreatePageTab.products ? (pageItems as SearchProductFragment[]) : [],
  variants:
    activeTab === VoucherCreatePageTab.variants
      ? (mapLocalVariantsToSavedVariants(
          pageItems as VoucherCreateProductVariant[],
        ) as unknown as VoucherCatalogueFragment["variants"])
      : null,
});
